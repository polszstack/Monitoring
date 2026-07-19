<?php

if (php_sapi_name() === 'cli-server') {
    $url = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . '/public' . ($url['path'] ?? '');

    if (is_file($file)) {
        return false;
    }
}

require_once __DIR__ . '/public/index.php';
