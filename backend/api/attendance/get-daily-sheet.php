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
    $date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
    $teacher_id = isset($_GET['teacher_id']) ? $_GET['teacher_id'] : null;
    $status = isset($_GET['status']) ? $_GET['status'] : null;
    $department = isset($_GET['department']) ? $_GET['department'] : null;
    
    $query = "SELECT da.*, t.employee_id, u.full_name as teacher_name, u.email,
              t.department, u2.full_name as marked_by_name
              FROM daily_attendance da 
              JOIN teachers t ON da.teacher_id = t.id 
              JOIN users u ON t.user_id = u.id 
              LEFT JOIN users u2 ON da.marked_by = u2.id
              WHERE da.attendance_date = :date";
    
    if ($teacher_id) {
        $query .= " AND da.teacher_id = :teacher_id";
    }
    
    if ($status) {
        $query .= " AND da.attendance_status = :status";
    }
    
    if ($department) {
        $query .= " AND t.department = :department";
    }
    
    $query .= " ORDER BY da.start_time, t.department";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':date', $date);
    
    if ($teacher_id) {
        $stmt->bindParam(':teacher_id', $teacher_id);
    }
    
    if ($status) {
        $stmt->bindParam(':status', $status);
    }
    
    if ($department) {
        $stmt->bindParam(':department', $department);
    }
    
    $stmt->execute();
    $attendance_sheet = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get summary statistics
    $statsQuery = "SELECT 
                    COUNT(*) as total_schedules,
                    SUM(CASE WHEN attendance_status = 'present' THEN 1 ELSE 0 END) as present_count,
                    SUM(CASE WHEN attendance_status = 'absent' THEN 1 ELSE 0 END) as absent_count,
                    SUM(CASE WHEN attendance_status = 'late' THEN 1 ELSE 0 END) as late_count,
                    SUM(CASE WHEN attendance_status = 'excused' THEN 1 ELSE 0 END) as excused_count,
                    SUM(CASE WHEN attendance_status = 'pending' THEN 1 ELSE 0 END) as pending_count
                   FROM daily_attendance 
                   WHERE attendance_date = :date";
    
    $statsStmt = $db->prepare($statsQuery);
    $statsStmt->bindParam(':date', $date);
    $statsStmt->execute();
    $statistics = $statsStmt->fetch(PDO::FETCH_ASSOC);
    
    Response::success([
        'attendance_sheet' => $attendance_sheet,
        'statistics' => $statistics,
        'date' => $date
    ], "Daily attendance sheet retrieved successfully");
    
} catch (PDOException $e) {
    Response::error("Database error: " . $e->getMessage(), 500);
}
?>