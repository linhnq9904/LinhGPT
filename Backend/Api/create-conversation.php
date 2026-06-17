<?php

require_once "../config/database.php";

$stmt = $conn->prepare(
    "INSERT INTO conversations(title)
     VALUES(?)"
);

$stmt->execute([
    "New Chat"
]);

$id = $conn->lastInsertId();

echo json_encode([
    "conversation_id" => $id
]);
