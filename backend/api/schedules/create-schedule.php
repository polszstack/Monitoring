<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

Auth::requireAdmin();

$data = json_decode(file_get_contents("php://input"));

$required_fields = ['teacher_id', 'day_of_week', 'start_time', 'end_time', 'subject'];
foreach ($required_fields as $field) {
    if (!isset($data->$field) || empty($data->$field)) {
        Response::error("$field is required");
    }
}

$database = new Database();
$db = $database->getConnection();

try {
    // Check for schedule conflicts
    $conflictQuery = "SELECT COUNT(*) as conflict_count 
                     FROM schedule_templates 
                     WHERE teacher_id = :teacher_id 
                     AND day_of_week = :day 
                     AND ((start_time <= :end_time AND end_time >= :start_time))";
    
    $conflictStmt = $db->prepare($conflictQuery);
    $conflictStmt->bindParam(':teacher_id', $data->teacher_id);
    $conflictStmt->bindParam(':day', $data->day_of_week);
    $conflictStmt->bindParam(':start_time', $data->start_time);
    $conflictStmt->bindParam(':end_time', $data->end_time);
    $conflictStmt->execute();
    $conflict = $conflictStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($conflict['conflict_count'] > 0) {
        Response::error("Schedule conflict detected for this time slot", 409);
    }
    
    $query = "INSERT INTO schedule_templates (teacher_id, day_of_week, start_time, end_time, subject, room, grade_level, section) 
              VALUES (:teacher_id, :day_of_week, :start_time, :end_time, :subject, :room, :grade_level, :section)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':teacher_id', $data->teacher_id);
    $stmt->bindParam(':day_of_week', $data->day_of_week);
    $stmt->bindParam(':start_time', $data->start_time);
    $stmt->bindParam(':end_time', $data->end_time);
    $stmt->bindParam(':subject', $data->subject);
    $stmt->bindParam(':room', $data->room);
    $stmt->bindParam(':grade_level', $data->grade_level);
    $stmt->bindParam(':section', $data->section);
    
    if ($stmt->execute()) {
        $schedule_id = $db->lastInsertId();
        
        $scheduleData = [
            'id' => $schedule_id,
            'teacher_id' => $data->teacher_id,
            'day_of_week' => $data->day_of_week,
            'start_time' => $data->start_time,
            'end_time' => $data->end_time,
            'subject' => $data->subject
        ];
        
        Response::created($scheduleData, "Schedule created successfully");
    } else {
        Response::error("Failed to create schedule");
    }
} catch (PDOException $e) {
    Response::error("Database error: " . $e->getMessage(), 500);
}
?>