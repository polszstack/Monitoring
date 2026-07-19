<?php

namespace App\Controllers;

use App\Config\Database;
use App\Middleware\AuthMiddleware;
use Firebase\JWT\JWT;
use PDO;

class AuthController
{
    public function login(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;

        if (!$username || !$password) {
            http_response_code(400);
            echo json_encode(['error' => 'Username and password are required']);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM users WHERE username = ?');
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
            return;
        }

        if ($user['status'] !== 'active') {
            http_response_code(401);
            echo json_encode(['error' => 'Account is inactive']);
            return;
        }

        $payload = [
            'id' => (int) $user['id'],
            'username' => $user['username'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + 86400,
        ];

        $token = JWT::encode($payload, getenv('JWT_SECRET') ?: 'default-secret', 'HS256');

        echo json_encode([
            'token' => $token,
            'user' => [
                'id' => (int) $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'full_name' => $user['full_name'],
                'role' => $user['role'],
            ],
        ]);
    }

    public function profile(): void
    {
        $user = AuthMiddleware::authenticate();
        echo json_encode(['user' => $user]);
    }
}
