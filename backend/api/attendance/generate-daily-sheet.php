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
$date = isset($data->date) ? $data->date : date('Y-m-d');
$day_of_week = date('l', strtotime($date));

$database = new Database();
$db = $database->getConnection();

try {
    // Check if attendance sheet already exists for this date
    $checkQuery = "SELECT COUNT(*) as count FROM daily_attendance WHERE attendance_date = :date";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':date', $date);
    $checkStmt->execute();
    $exists = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($exists['count'] > 0) {
        Response::error("Attendance sheet already exists for this date");
    }
    
    // Get all schedules for this day
    $scheduleQuery = "SELECT st.*, t.id as teacher_id, t.employee_id, u.full_name 
                     FROM schedule_templates st 
                     JOIN teachers t ON st.teacher_id = t.id 
                     JOIN users u ON t.user_id = u.id 
                     WHERE st.day_of_week = :day_of_week 
                     ORDER BY st.start_time";
    
    $scheduleStmt = $db->prepare($scheduleQuery);
    $scheduleStmt->bindParam(':day_of_week', $day_of_week);
    $scheduleStmt->execute();
    $schedules = $scheduleStmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($schedules) === 0) {
        Response::error("No schedules found for $day_of_week");
    }
    
    // Insert into daily attendance
    $insertQuery = "INSERT INTO daily_attendance 
                    (schedule_template_id, teacher_id, attendance_date, day_of_week, 
                     start_time, end_time, subject, room, grade_level, section, attendance_status) 
                    VALUES 
                    (:schedule_template_id, :teacher_id, :attendance_date, :day_of_week,
                     :start_time, :end_time, :subject, :room, :grade_level, :section, 'pending')";
    
    $insertStmt = $db->prepare($insertQuery);
    $inserted_count = 0;
    
    foreach ($schedules as $schedule) {
        $insertStmt->bindParam(':schedule_template_id', $schedule['id']);
        $insertStmt->bindParam(':teacher_id', $schedule['teacher_id']);
        $insertStmt->bindParam(':attendance_date', $date);
        $insertStmt->bindParam(':day_of_week', $day_of_week);
        $insertStmt->bindParam(':start_time', $schedule['start_time']);
        $insertStmt->bindParam(':end_time', $schedule['end_time']);
        $insertStmt->bindParam(':subject', $schedule['subject']);
        $insertStmt->bindParam(':room', $schedule['room']);
        $insertStmt->bindParam(':grade_level', $schedule['grade_level']);
        $insertStmt->bindParam(':section', $schedule['section']);
        
        if ($insertStmt->execute()) {
            $inserted_count++;
        }
    }
    
    Response::created(
        ['generated_count' => $inserted_count, 'date' => $date],
        "Daily attendance sheet generated with $inserted_count entries"
    );
    
} catch (PDOException $e) {
    Response::error("Database error: " . $e->getMessage(), 500);
}
?>