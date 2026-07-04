<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->password)) {
    Response::error("Username and password are required");
}

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT u.*, t.id as teacher_id 
              FROM users u 
              LEFT JOIN teachers t ON u.id = t.user_id 
              WHERE u.username = :username AND u.status = 'active'";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $data->username);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify($data->password, $user['password'])) {
            $token = Auth::generateToken($user);
            
            $userData = [
                'id' => $user['id'],
                'username' => $user['username'],
                'full_name' => $user['full_name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'teacher_id' => $user['teacher_id'],
                'token' => $token
            ];
            
            Response::success($userData, "Login successful");
        } else {
            Response::error("Invalid credentials", 401);
        }
    } else {
        Response::error("Invalid credentials", 401);
    }
} catch (PDOException $e) {
    Response::error("Database error: " . $e->getMessage(), 500);
}
?>