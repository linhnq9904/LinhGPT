<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
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

$input = json_decode(
    file_get_contents("php://input"),
    true
);

$message = $input["message"] ?? "";

$url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key="
    . GEMINI_API_KEY;

$data = [
    "contents" => [
        [
            "parts" => [
                [
                    "text" => $message
                ]
            ]
        ]
    ]
];

$ch = curl_init($url);

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS => json_encode($data),

    CURLOPT_WRITEFUNCTION =>
    function ($ch, $chunk) {

        echo $chunk;

        @ob_flush();
        flush();

        return strlen($chunk);
    }
]);

curl_exec($ch);
curl_close($ch);
