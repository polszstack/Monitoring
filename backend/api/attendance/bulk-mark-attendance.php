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

if (!isset($data->attendance_records) || !is_array($data->attendance_records)) {
    Response::error("Attendance records array is required");
}

$database = new Database();
$db = $database->getConnection();

try {
    $db->beginTransaction();
    
    $updateQuery = "UPDATE daily_attendance SET 
                    attendance_status = :status,
                    time_marked = CURRENT_TIME(),
                    remarks = :remarks,
                    marked_by = :marked_by
                    WHERE id = :id";
    
    $updateStmt = $db->prepare($updateQuery);
    $updated_count = 0;
    $errors = [];
    
    foreach ($data->attendance_records as $record) {
        if (!isset($record->id) || !isset($record->status)) {
            $errors[] = "Invalid record format";
            continue;
        }
        
        $status = $record->status;
        $remarks = isset($record->remarks) ? $record->remarks : null;
        
        $updateStmt->bindParam(':status', $status);
        $updateStmt->bindParam(':remarks', $remarks);
        $updateStmt->bindParam(':marked_by', $user['user_id']);
        $updateStmt->bindParam(':id', $record->id);
        
        if ($updateStmt->execute()) {
            $updated_count += $updateStmt->rowCount();
        }
    }
    
    $db->commit();
    
    Response::success([
        'updated_count' => $updated_count,
        'total_records' => count($data->attendance_records),
        'errors' => $errors
    ], "Bulk attendance update completed");
    
} catch (PDOException $e) {
    $db->rollBack();
    Response::error("Database error: " . $e->getMessage(), 500);
}
?>