<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Auth-Token");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";
require_once "../middleware/AuthMiddleware.php";

$user = getAuthUser();
$userId = $user->user_id;

$conversationId = $_GET["conversation_id"] ?? 0;

$stmt = $conn->prepare(
    "SELECT m.role, m.content
     FROM messages m
     INNER JOIN conversations c
        ON m.conversation_id = c.id
     WHERE m.conversation_id = ?
       AND c.user_id = ?
     ORDER BY m.id ASC"
);

$stmt->execute([
    $conversationId,
    $userId
]);

echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC)
);
