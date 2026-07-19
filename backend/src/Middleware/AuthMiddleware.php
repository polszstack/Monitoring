<?php

namespace App\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    public static function authenticate(): ?array
    {
        $headers = getallheaders();
        $token = null;

        if (!empty($headers['Authorization']) && str_starts_with($headers['Authorization'], 'Bearer ')) {
            $token = substr($headers['Authorization'], 7);
        }

        if (!$token && !empty($_SERVER['HTTP_X_ACCESS_TOKEN'])) {
            $token = $_SERVER['HTTP_X_ACCESS_TOKEN'];
        }

        if (!$token && !empty($_GET['token'])) {
            $token = $_GET['token'];
        }

        if (!$token) {
            http_response_code(401);
            echo json_encode(['error' => 'Access token required']);
            exit;
        }

        try {
            $secret = getenv('JWT_SECRET') ?: 'default-secret';
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            return [
                'id' => $decoded->id,
                'username' => $decoded->username,
                'role' => $decoded->role,
            ];
        } catch (\Throwable $e) {
            http_response_code(403);
            echo json_encode(['error' => 'Invalid or expired token', 'details' => $e->getMessage()]);
            exit;
        }
    }

    public static function authorizeAdmin(array $user): void
    {
        if ($user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Admin access required']);
            exit;
        }
    }
}
