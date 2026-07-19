<?php

namespace App\Controllers;

use App\Config\Database;
use PDO;

class TeacherController
{
    public function getAllTeachers(): void
    {
        $db = Database::getConnection();
        $stmt = $db->query(
            'SELECT t.*, u.full_name, u.email, u.username, u.status as user_status FROM teachers t JOIN users u ON t.user_id = u.id ORDER BY t.id DESC'
        );
        $teachers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($teachers);
    }

    public function getTeacher(array $params): void
    {
        $db = Database::getConnection();
        $stmt = $db->prepare(
            'SELECT t.*, u.full_name, u.email, u.username, u.status as user_status FROM teachers t JOIN users u ON t.user_id = u.id WHERE t.id = ?'
        );
        $stmt->execute([$params['id']]);
        $teacher = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$teacher) {
            http_response_code(404);
            echo json_encode(['error' => 'Teacher not found']);
            return;
        }

        echo json_encode($teacher);
    }

    public function createTeacher(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $required = ['username', 'password', 'email', 'full_name', 'employee_id'];
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
            $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);
            $stmt = $db->prepare('INSERT INTO users (username, password, email, full_name, role) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$data['username'], $passwordHash, $data['email'], $data['full_name'], 'teacher']);
            $userId = (int) $db->lastInsertId();

            $stmt = $db->prepare(
                'INSERT INTO teachers (user_id, employee_id, department, position, contact_number, address) VALUES (?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $userId,
                $data['employee_id'],
                $data['department'] ?? null,
                $data['position'] ?? null,
                $data['contact_number'] ?? null,
                $data['address'] ?? null,
            ]);

            $teacherId = (int) $db->lastInsertId();
            $db->commit();

            http_response_code(201);
            echo json_encode(['message' => 'Teacher created successfully', 'id' => $teacherId]);
        } catch (\Throwable $e) {
            $db->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'details' => $e->getMessage()]);
        }
    }

    public function updateTeacher(array $params): void
    {
        $id = $params['id'];
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'No update data provided']);
            return;
        }

        $allowed = ['employee_id', 'department', 'position', 'contact_number', 'address'];
        $fields = [];
        $values = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid fields provided for update']);
            return;
        }

        $values[] = $id;
        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE teachers SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmt->execute($values);

        echo json_encode(['message' => 'Teacher updated successfully']);
    }
}
