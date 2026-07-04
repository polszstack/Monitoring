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
    $teacher_id = isset($_GET['teacher_id']) ? $_GET['teacher_id'] : null;
    $day = isset($_GET['day']) ? $_GET['day'] : date('l');
    
    $query = "SELECT st.*, t.employee_id, u.full_name as teacher_name, u.email,
              t.department
              FROM schedule_templates st 
              JOIN teachers t ON st.teacher_id = t.id 
              JOIN users u ON t.user_id = u.id 
              WHERE st.day_of_week = :day";
    
    if ($teacher_id) {
        $query .= " AND st.teacher_id = :teacher_id";
    }
    
    $query .= " ORDER BY t.department, st.start_time";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':day', $day);
    
    if ($teacher_id) {
        $stmt->bindParam(':teacher_id', $teacher_id);
    }
    
    $stmt->execute();
    $schedules = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    Response::success($schedules, "Schedules retrieved successfully");
} catch (PDOException $e) {
    Response::error("Database error: " . $e->getMessage(), 500);
}
?>