<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 86400");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");
header("X-Accel-Buffering: no");

while (ob_get_level() > 0) {
    ob_end_flush();
}

ob_implicit_flush(true);


require_once "../config/config.php";
require_once "../config/database.php";

$input = json_decode(
    file_get_contents("php://input"),
    true
);

$message = $input["message"] ?? "";

$conversationId =
    $input["conversation_id"] ?? 1;

$stmt = $conn->prepare(
    "INSERT INTO messages
    (
        conversation_id,
        role,
        content
    )
    VALUES
    (
        ?, ?, ?
    )"
);

$stmt->execute([
    $conversationId,
    "user",
    $message
]);

$url = "https://api.groq.com/openai/v1/chat/completions";

$data = [
    "model" => "llama-3.3-70b-versatile",
    "messages" => [
        [
            "role" => "system",
            "content" => "Bạn là LinhGPT, một trợ lý AI hữu ích. Trả lời bằng tiếng Việt."
        ],
        [
            "role" => "user",
            "content" => $message
        ]
    ],
    "stream" => true
];
$ch = curl_init($url);

$assistantAnswer = "";

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . GROQ_API_KEY
    ],
    CURLOPT_POSTFIELDS => json_encode($data),

    CURLOPT_WRITEFUNCTION => function ($ch, $chunk) use (&$assistantAnswer) {

        $lines = explode("\n", $chunk);

        foreach ($lines as $line) {
            if (strpos($line, "data:") !== 0)
                continue;

            $json = trim(str_replace("data:", "", $line));

            if ($json === "[DONE]" || $json === "")
                continue;

            $parsed = json_decode($json, true);

            $text = $parsed["choices"][0]["delta"]["content"] ?? "";

            $assistantAnswer .= $text;
        }

        echo $chunk;

        @ob_flush();
        flush();

        return strlen($chunk);
    }
]);

curl_exec($ch);
curl_close($ch);

$stmt = $conn->prepare(
    "INSERT INTO messages(conversation_id, role, content)
     VALUES (?, ?, ?)"
);

$stmt->execute([
    $conversationId,
    "assistant",
    $assistantAnswer
]);
