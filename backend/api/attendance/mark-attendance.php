<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Response::error("Method not allowed", 405);
}

$user = Auth::requireAdmin();

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->attendance_id) || !isset($data->status)) {
    Response::error("Attendance ID and status are required");
}

$valid_statuses = ['present', 'absent', 'late', 'excused'];
if (!in_array($data->status, $valid_statuses)) {
    Response::error("Invalid status. Must be one of: " . implode(', ', $valid_statuses));
}

$database = new Database();
$db = $database->getConnection();

try {
    $query = "UPDATE daily_attendance SET 
              attendance_status = :status,
              time_marked = CURRENT_TIME(),
              remarks = :remarks,
              marked_by = :marked_by
              WHERE id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':status', $data->status);
    $stmt->bindParam(':remarks', $data->remarks);
    $stmt->bindParam(':marked_by', $user['user_id']);
    $stmt->bindParam(':id', $data->attendance_id);
    
    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            // Get updated record
            $getQuery = "SELECT da.*, t.employee_id, u.full_name as teacher_name 
                        FROM daily_attendance da 
                        JOIN teachers t ON da.teacher_id = t.id 
                        JOIN users u ON t.user_id = u.id 
                        WHERE da.id = :id";
            
            $getStmt = $db->prepare($getQuery);
            $getStmt->bindParam(':id', $data->attendance_id);
            $getStmt->execute();
            $updated_record = $getStmt->fetch(PDO::FETCH_ASSOC);
            
            Response::success($updated_record, "Attendance marked successfully");
        } else {
            Response::error("Attendance record not found");
        }
    } else {
        Response::error("Failed to update attendance");
    }
} catch (PDOException $e) {
    Response::error("Database error: " . $e->getMessage(), 500);
}
?>