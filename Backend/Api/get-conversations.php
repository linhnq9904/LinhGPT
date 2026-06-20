<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
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

$stmt = $conn->prepare(
    "SELECT 
        c.id,
        COALESCE(
            (
                SELECT LEFT(m.content, 40)
                FROM messages m
                WHERE m.conversation_id = c.id
                  AND m.role = 'user'
                ORDER BY m.id ASC
                LIMIT 1
            ),
            c.title,
            'Cuộc trò chuyện mới'
        ) AS title,
        c.created_at,
        c.updated_at
     FROM conversations c
     WHERE c.user_id = ?
     ORDER BY c.updated_at DESC, c.id DESC"
);

$stmt->execute([$userId]);

echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC),
    JSON_UNESCAPED_UNICODE
);
