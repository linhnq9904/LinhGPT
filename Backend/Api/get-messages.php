<?php

require_once "../config/database.php";

$id =
    $_GET["conversation_id"];

$stmt = $conn->prepare(
    "SELECT role, content
     FROM messages
     WHERE conversation_id = ?
     ORDER BY id ASC"
);

$stmt->execute([$id]);

echo json_encode(
    $stmt->fetchAll(
        PDO::FETCH_ASSOC
    )
);
