<?php

namespace App\Controllers;

use App\Config\Database;
use App\Middleware\AuthMiddleware;
use PDO;

class AttendanceController
{
    public function getAttendanceByDate(array $params): void
    {
        $date = $params['date'];
        $includeArchived = ($_GET['include_archived'] ?? 'false') === 'true';

        $db = Database::getConnection();
        $sql = 'SELECT da.id, da.teacher_id, da.attendance_date, da.day_of_week, da.start_time, da.end_time, da.subject, da.room, da.grade_level, da.section, da.attendance_status, da.time_marked, da.remarks, da.marked_by, da.verification_photo, da.is_archived, u.full_name as teacher_name, t.employee_id, t.department FROM daily_attendance da JOIN teachers t ON da.teacher_id = t.id JOIN users u ON t.user_id = u.id WHERE da.attendance_date = ?';

        if (!$includeArchived) {
            $sql .= ' AND da.is_archived = 0';
        }

        $sql .= ' ORDER BY da.start_time ASC, da.room ASC';
        $stmt = $db->prepare($sql);
        $stmt->execute([$date]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function markAttendance(array $params): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $params['id'];
        $status = $data['attendance_status'] ?? null;
        $remarks = $data['remarks'] ?? null;

        $validStatuses = ['present', 'absent', 'late', 'excused'];
        if (!in_array($status, $validStatuses, true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid attendance status']);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE daily_attendance SET attendance_status = ?, time_marked = ?, remarks = ? WHERE id = ?');
        $stmt->execute([$status, date('H:i:s'), $remarks, $id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Attendance record not found']);
            return;
        }

        echo json_encode(['message' => 'Attendance marked successfully']);
    }

    public function bulkMarkAttendance(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $attendances = $data['attendances'] ?? [];

        if (!is_array($attendances) || empty($attendances)) {
            http_response_code(400);
            echo json_encode(['error' => 'Attendances array is required']);
            return;
        }

        $db = Database::getConnection();
        $db->beginTransaction();

        try {
            $stmt = $db->prepare('UPDATE daily_attendance SET attendance_status = ?, time_marked = ?, remarks = ? WHERE id = ?');
            foreach ($attendances as $entry) {
                $stmt->execute([
                    $entry['attendance_status'], 
                    date('H:i:s'), 
                    $entry['remarks'] ?? null,
                    $entry['id']
                ]);
            }
            $db->commit();
            echo json_encode(['message' => count($attendances) . ' attendance records marked successfully']);
        } catch (\Throwable $e) {
            $db->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'details' => $e->getMessage()]);
        }
    }

    public function toggleArchive(array $params): void
    {
        $id = $params['id'];
        $data = json_decode(file_get_contents('php://input'), true);
        $isArchived = !empty($data['is_archived']) ? 1 : 0;

        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE daily_attendance SET is_archived = ? WHERE id = ?');
        $stmt->execute([$isArchived, $id]);

        echo json_encode(['message' => 'Archive status updated']);
    }

    public function verifyPresent(array $params): void
    {
        $id = $params['id'];
        $user = AuthMiddleware::authenticate();
        $status = $_POST['attendance_status'] ?? 'present';
        $remarks = $_POST['remarks'] ?? null;

        if (empty($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'Verification photo is required']);
            return;
        }

        $uploadDir = __DIR__ . '/../../public/uploads/verification_photos';
        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0777, true) && !is_dir($uploadDir)) {
            http_response_code(500);
            echo json_encode(['error' => 'Unable to create upload directory']);
            return;
        }

        $filename = 'verify-' . time() . '-' . bin2hex(random_bytes(6)) . '-' . basename($_FILES['photo']['name']);
        $targetPath = $uploadDir . '/' . $filename;

        if (!move_uploaded_file($_FILES['photo']['tmp_name'], $targetPath)) {
            http_response_code(500);
            echo json_encode(['error' => 'Could not save uploaded photo']);
            return;
        }

        $photoPath = '/uploads/verification_photos/' . $filename;
        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE daily_attendance SET attendance_status = ?, remarks = ?, time_marked = ?, marked_by = ?, verification_photo = ? WHERE id = ?');
        $stmt->execute([$status, $remarks, date('H:i:s'), $user['id'], $photoPath, $id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Attendance record not found']);
            return;
        }

        echo json_encode(['message' => 'Attendance verified with photo successfully', 'photoPath' => $photoPath]);
    }

    public function bulkArchive(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $date = $data['date'] ?? null;
        $isArchived = !empty($data['is_archived']) ? 1 : 0;

        if (!$date) {
            http_response_code(400);
            echo json_encode(['error' => 'date is required']);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE daily_attendance SET is_archived = ? WHERE attendance_date = ?');
        $stmt->execute([$isArchived, $date]);

        echo json_encode(['message' => 'Bulk archive status updated']);
    }
}
