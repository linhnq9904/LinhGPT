<?php

require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/../config/config.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function getAuthUser()
{
    $authHeader = "";

    if (function_exists("apache_request_headers")) {
        $headers = apache_request_headers();

        foreach ($headers as $key => $value) {
            if (strtolower($key) === "authorization") {
                $authHeader = $value;
                break;
            }
        }
    }

    if (!$authHeader) {
        $authHeader =
            $_SERVER["HTTP_X_AUTH_TOKEN"] ??
            $_SERVER["HTTP_AUTHORIZATION"] ??
            $_SERVER["REDIRECT_HTTP_AUTHORIZATION"] ??
            "";
    }

    if (!$authHeader) {
        $authHeader = $_SERVER["HTTP_X_AUTH_TOKEN"] ?? "";
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Thiếu token",
            "server" => $_SERVER
        ]);
        exit();
    }

    $token = trim(str_replace("Bearer", "", $authHeader));

    try {
        return JWT::decode(
            $token,
            new Key(JWT_SECRET, "HS256")
        );
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Token không hợp lệ",
            "error" => $e->getMessage()
        ]);
        exit();
    }
}

