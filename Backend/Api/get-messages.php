<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

require_once "../config/database.php";

$conversationId = $_GET["conversation_id"] ?? 0;

$stmt = $conn->prepare(
    "SELECT role, content
     FROM messages
     WHERE conversation_id = ?
     ORDER BY id ASC"
);

$stmt->execute([$conversationId]);

echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC)
);
