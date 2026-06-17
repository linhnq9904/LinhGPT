<?php

header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");

$text = "Hello, this is a streaming response from the server!";

$word = explode(" ", $text);

foreach ($word as $w) {

    echo "data: {$w}\n\n";

    ob_flush();
    flush();

    sleep(1);
}
