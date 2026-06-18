<?php

class GeminiService
{
    private $apiKey;

    public function __construct()
    {
        $this->apiKey = GEMINI_API_KEY;
    }

    public function chat($message)
    {

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key={$this->apiKey}";

        $data = [
            "contents" => [
                [
                    "parts" => [
                        [
                            "text" => $message
                        ]
                    ]
                ]
            ]
        ];

        $ch = curl_init($url);

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                "Content-Type: application/json"
            ],
            CURLOPT_POSTFIELDS => json_encode($data)
        ]);

        $response = curl_exec($ch);

        curl_close($ch);

        return json_decode($response, true);
    }
}
