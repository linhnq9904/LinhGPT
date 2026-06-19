<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once "../../middleware/AuthMiddleware.php";

$user = getAuthUser();

echo json_encode([
    "success" => true,
    "user" => $user
]);
