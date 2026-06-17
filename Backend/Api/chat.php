<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once "../config/config.php";
require_once "../services/GeminiService.php";

$input = json_decode(file_get_contents("php://input"), true);

$message = $input["message"] ?? "";

$geminiService = new GeminiService();

$result = $geminiService->chat($message);

echo json_encode($result);
