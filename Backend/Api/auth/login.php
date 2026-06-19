<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../../config/database.php";
require_once "../../config/config.php";
require_once "../../vendor/autoload.php";

use Firebase\JWT\JWT;

$input = json_decode(
    file_get_contents("php://input"),
    true
);

$email = trim($input["email"] ?? "");
$password = trim($input["password"] ?? "");

$stmt = $conn->prepare(
    "SELECT id, fullname, email, password
    FROM users
    WHERE email = ?"
);

$stmt->execute([$email]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($input["password"], $user["password"])) {
    echo json_encode([
        "success" => false,
        "message" => "Email hoặc mật khẩu không đúng"
    ]);
    exit();
}
$payload = [
    "user_id" => $user["id"],
    "email" => $user["email"],
    "exp" => time() + 86400
];

$token = JWT::encode(
    $payload,
    JWT_SECRET,
    "HS256"
);

echo json_encode([
    "success" => true,
    "token" => $token,
    "user" => [
        "id" => $user["id"],
        "fullname" => $user["fullname"],
        "email" => $user["email"]
    ]
]);
