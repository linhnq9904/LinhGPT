<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");

require_once "../config/database.php";

$stmt = $conn->prepare("
    SELECT 
        conversation_id AS id,
        MIN(content) AS title,
        MAX(created_at) AS last_time
    FROM messages
    WHERE role = 'user'
    GROUP BY conversation_id
    ORDER BY last_time DESC
");

$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
