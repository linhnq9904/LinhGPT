<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "../config/config.php";
require_once "../services/GeminiService.php";

$input = json_decode(file_get_contents("php://input"), true);

$message = $input["message"] ?? "";

$geminiService = new GeminiService();

$result = $geminiService->chat($message);

echo json_encode($result);
