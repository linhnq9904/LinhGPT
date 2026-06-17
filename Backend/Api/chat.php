<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";
require_once "../config/config.php";
require_once "../services/GeminiService.php";

$input = json_decode(file_get_contents("php://input"), true);

$message = $input["message"] ?? "";
$conversationId = $input["conversation_id"] ?? 1;

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

$geminiService = new GeminiService();

$result = $geminiService->chat($message);

$answer =
    $result["candidates"][0]["content"]["parts"][0]["text"] ?? "";

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
    "assistant",
    $answer
]);

echo json_encode([
    "answer" => $answer
]);
