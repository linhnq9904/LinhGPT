<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");

require_once "../config/database.php";
require_once "../middleware/AuthMiddleware.php";

$user = getAuthUser();
$userId = $user->user_id;

$stmt = $conn->prepare(
    "SELECT id, title, created_at
     FROM conversations
     WHERE user_id = ?
     ORDER BY id DESC"
);

$stmt->execute([$userId]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
