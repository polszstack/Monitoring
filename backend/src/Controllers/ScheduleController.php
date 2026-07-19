<?php

namespace App\Controllers;

use App\Config\Database;
use PDO;

class ScheduleController
{
    public function getScheduleTemplates(): void
    {
        $teacherId = $_GET['teacher_id'] ?? null;
        $db = Database::getConnection();

        $sql = 'SELECT st.*, t.employee_id, u.full_name as teacher_name FROM schedule_templates st JOIN teachers t ON st.teacher_id = t.id JOIN users u ON t.user_id = u.id';
        $params = [];

        if ($teacherId) {
            $sql .= ' WHERE st.teacher_id = ?';
            $params[] = $teacherId;
        }

        $sql .= ' ORDER BY FIELD(st.day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), st.start_time';

        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function createScheduleTemplate(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $required = ['teacher_name', 'day_of_week', 'start_time', 'end_time', 'subject'];

        foreach ($required as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "{$field} is required"]);
                return;
            }
        }

        $db = Database::getConnection();
        $db->beginTransaction();

        try {
            $teacherName = $data['teacher_name'];
            $stmt = $db->prepare('SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.full_name = ?');
            $stmt->execute([$teacherName]);
            $teacher = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($teacher) {
                $teacherId = (int) $teacher['id'];
            } else {
                $username = strtolower(str_replace(' ', '', $teacherName));
                $existing = $db->prepare('SELECT id FROM users WHERE username = ?');
                $existing->execute([$username]);

                if ($existing->fetch()) {
                    $username .= time();
                }

                $email = $username . '@school.com';
                $passwordHash = password_hash('defaultPassword123', PASSWORD_BCRYPT);
                $stmt = $db->prepare('INSERT INTO users (username, password, email, full_name, role, status) VALUES (?, ?, ?, ?, ?, ?)');
                $stmt->execute([$username, $passwordHash, $email, $teacherName, 'teacher', 'active']);
                $userId = (int) $db->lastInsertId();

                $employeeId = $data['employee_id'] ?? 'TCH-' . time();
                $stmt = $db->prepare('SELECT id FROM teachers WHERE employee_id = ?');
                $stmt->execute([$employeeId]);

                if ($stmt->fetch()) {
                    $employeeId = 'TCH-' . time();
                }

                $stmt = $db->prepare('INSERT INTO teachers (user_id, employee_id, department) VALUES (?, ?, ?)');
                $stmt->execute([$userId, $employeeId, 'General']);
                $teacherId = (int) $db->lastInsertId();
            }

            $stmt = $db->prepare('SELECT id FROM schedule_templates WHERE teacher_id = ? AND day_of_week = ? AND start_time = ?');
            $stmt->execute([$teacherId, $data['day_of_week'], $data['start_time']]);

            if ($stmt->fetch()) {
                http_response_code(400);
                echo json_encode(['error' => 'A schedule already exists for this teacher at this time']);
                $db->rollBack();
                return;
            }

            $stmt = $db->prepare(
                'INSERT INTO schedule_templates (teacher_id, day_of_week, start_time, end_time, subject, room, grade_level, section) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $teacherId,
                $data['day_of_week'],
                $data['start_time'],
                $data['end_time'] ?? null,
                $data['subject'],
                $data['room'] ?? null,
                $data['grade_level'] ?? null,
                $data['section'] ?? null,
            ]);

            $scheduleId = (int) $db->lastInsertId();

            $db->commit();

            http_response_code(201);
            echo json_encode(['message' => 'Schedule template created successfully', 'id' => $scheduleId]);
        } catch (\Throwable $e) {
            $db->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'details' => $e->getMessage()]);
        }
    }

    public function generateAttendance(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $date = $data['date'] ?? date('Y-m-d');
        $dayOfWeek = date('l', strtotime($date));

        $db = Database::getConnection();
        $stmt = $db->prepare(
            'SELECT st.*, t.id as teacher_id, t.employee_id, u.full_name as teacher_name FROM schedule_templates st JOIN teachers t ON st.teacher_id = t.id JOIN users u ON t.user_id = u.id WHERE st.day_of_week = ?'
        );
        $stmt->execute([$dayOfWeek]);
        $templates = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $created = 0;
        $insert = $db->prepare(
            'INSERT INTO daily_attendance (schedule_template_id, teacher_id, attendance_date, day_of_week, start_time, end_time, subject, room, grade_level, section, attendance_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );

        foreach ($templates as $template) {
            $check = $db->prepare('SELECT id FROM daily_attendance WHERE teacher_id = ? AND attendance_date = ? AND start_time = ?');
            $check->execute([$template['teacher_id'], $date, $template['start_time']]);
            if ($check->fetch()) {
                continue;
            }
            $insert->execute([
                $template['id'],
                $template['teacher_id'],
                $date,
                $dayOfWeek,
                $template['start_time'],
                $template['end_time'],
                $template['subject'],
                $template['room'],
                $template['grade_level'],
                $template['section'],
                'pending',
            ]);
            $created++;
        }

        echo json_encode(['message' => 'Attendance generated successfully', 'created' => $created]);
    }
}
