<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

Auth::validateToken();

$database = new Database();
$db = $database->getConnection();

try {
    $department = isset($_GET['department']) ? $_GET['department'] : null;
    
    $query = "SELECT t.*, u.full_name, u.email, u.username 
              FROM teachers t 
              JOIN users u ON t.user_id = u.id 
              WHERE u.status = 'active'";
    
    if ($department) {
        $query .= " AND t.department = :department";
    }
    
    $query .= " ORDER BY u.full_name";
    
    $stmt = $db->prepare($query);
    
    if ($department) {
        $stmt->bindParam(':department', $department);
    }
    
    $stmt->execute();
    $teachers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    Response::success($teachers, "Teachers retrieved successfully");
} catch (PDOException $e) {
    Response::error("Database error: " . $e->getMessage(), 500);
}
?>