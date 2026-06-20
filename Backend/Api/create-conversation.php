<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Auth-Token");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";
require_once "../middleware/AuthMiddleware.php";

$user = getAuthUser();
$userId = $user->user_id;

$stmt = $conn->prepare(
    "INSERT INTO conversations(title, user_id, created_at, updated_at)
     VALUES (?, ?, NOW(), NOW())"
);

$stmt->execute([
    "Cuộc trò chuyện mới",
    $userId
]);
echo json_encode([
    "success" => true,
    "conversation_id" => $conn->lastInsertId()
]);
