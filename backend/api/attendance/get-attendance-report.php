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
    $date_from = isset($_GET['date_from']) ? $_GET['date_from'] : date('Y-m-01');
    $date_to = isset($_GET['date_to']) ? $_GET['date_to'] : date('Y-m-t');
    $teacher_id = isset($_GET['teacher_id']) ? $_GET['teacher_id'] : null;
    
    // Get attendance summary per teacher
    $query = "SELECT 
                t.id as teacher_id,
                t.employee_id,
                u.full_name as teacher_name,
                t.department,
                COUNT(*) as total_classes,
                SUM(CASE WHEN da.attendance_status = 'present' THEN 1 ELSE 0 END) as present_count,
                SUM(CASE WHEN da.attendance_status = 'absent' THEN 1 ELSE 0 END) as absent_count,
                SUM(CASE WHEN da.attendance_status = 'late' THEN 1 ELSE 0 END) as late_count,
                SUM(CASE WHEN da.attendance_status = 'excused' THEN 1 ELSE 0 END) as excused_count,
                ROUND(
                    (SUM(CASE WHEN da.attendance_status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 
                    2
                ) as attendance_percentage
              FROM daily_attendance da
              JOIN teachers t ON da.teacher_id = t.id
              JOIN users u ON t.user_id = u.id
              WHERE da.attendance_date BETWEEN :date_from AND :date_to";
    
    if ($teacher_id) {
        $query .= " AND da.teacher_id = :teacher_id";
    }
    
    $query .= " GROUP BY t.id, t.employee_id, u.full_name, t.department
                ORDER BY attendance_percentage DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':date_from', $date_from);
    $stmt->bindParam(':date_to', $date_to);
    
    if ($teacher_id) {
        $stmt->bindParam(':teacher_id', $teacher_id);
    }
    
    $stmt->execute();
    $report = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get overall statistics
    $overallQuery = "SELECT 
                        COUNT(DISTINCT attendance_date) as total_days,
                        COUNT(*) as total_records,
                        SUM(CASE WHEN attendance_status = 'present' THEN 1 ELSE 0 END) as total_present,
                        SUM(CASE WHEN attendance_status = 'absent' THEN 1 ELSE 0 END) as total_absent
                     FROM daily_attendance 
                     WHERE attendance_date BETWEEN :date_from AND :date_to";
    
    $overallStmt = $db->prepare($overallQuery);
    $overallStmt->bindParam(':date_from', $date_from);
    $overallStmt->bindParam(':date_to', $date_to);
    $overallStmt->execute();
    $overall_stats = $overallStmt->fetch(PDO::FETCH_ASSOC);
    
    Response::success([
        'teacher_report' => $report,
        'overall_statistics' => $overall_stats,
        'date_range' => [
            'from' => $date_from,
            'to' => $date_to
        ]
    ], "Attendance report generated successfully");
    
} catch (PDOException $e) {
    Response::error("Database error: " . $e->getMessage(), 500);
}
?>