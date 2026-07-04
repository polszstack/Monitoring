<?php
require_once __DIR__ . '/../utils/response.php';

class Auth {
    private static $secret_key = "your_secret_key_here";
    
    public static function validateToken() {
        $headers = getallheaders();
        
        if (!isset($headers['Authorization'])) {
            Response::error("No token provided", 401);
        }

        $token = str_replace('Bearer ', '', $headers['Authorization']);
        
        // Simple token validation (in production, use JWT)
        try {
            $decoded = json_decode(base64_decode($token), true);
            if (!$decoded || !isset($decoded['user_id']) || !isset($decoded['exp'])) {
                Response::error("Invalid token", 401);
            }
            
            if ($decoded['exp'] < time()) {
                Response::error("Token expired", 401);
            }
            
            return $decoded;
        } catch (Exception $e) {
            Response::error("Invalid token format", 401);
        }
    }

    public static function generateToken($user) {
        $payload = [
            'user_id' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role'],
            'teacher_id' => $user['teacher_id'] ?? null,
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ];
        
        return base64_encode(json_encode($payload));
    }

    public static function requireAdmin() {
        $user = self::validateToken();
        if ($user['role'] !== 'admin') {
            Response::error("Admin access required", 403);
        }
        return $user;
    }
}
?>