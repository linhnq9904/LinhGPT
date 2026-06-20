<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Auth-Token");
header("Access-Control-Allow-Methods: DELETE, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";
require_once "../middleware/AuthMiddleware.php";

$user = getAuthUser();
$userId = $user->user_id;

$input = json_decode(file_get_contents("php://input"), true);

$conversationId = $input["conversation_id"] ?? 0;

$stmt = $conn->prepare(
    "DELETE FROM conversations
     WHERE id = ?
       AND user_id = ?"
);

$stmt->execute([
    $conversationId,
    $userId
]);

echo json_encode([
    "success" => true
]);
