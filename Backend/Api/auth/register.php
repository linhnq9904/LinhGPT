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

$input = json_decode(
    file_get_contents("php://input"),
    true
);

$fullname = trim($input["fullname"] ?? "");
$email = trim($input["email"] ?? "");
$password = trim($input["password"] ?? "");

if (
    !$fullname ||
    !$email ||
    !$password
) {
    echo json_encode([
        "success" => false,
        "message" => "Vui lòng nhập đầy đủ thông tin"
    ]);
    exit();
}

$stmt = $conn->prepare(
    "SELECT id
    FROM users
    WHERE email = ?"
);

$stmt->execute([$email]);

if ($stmt->fetch()) {

    echo json_encode([
        "success" => false,
        "message" => "Email đã tồn tại"
    ]);

    exit();
}

$hashedPassword =
    password_hash(
        $password,
        PASSWORD_DEFAULT
    );

$stmt = $conn->prepare(
    "INSERT INTO users
    (
        fullname,
        email,
        password
    )
    VALUES
    (
        ?, ?, ?
    )"
);

$stmt->execute([
    $fullname,
    $email,
    $hashedPassword
]);

echo json_encode([
    "success" => true,
    "message" => "Đăng ký thành công"
]);
