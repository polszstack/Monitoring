<?php

namespace App\Controllers;

use App\Config\Database;
use PDO;

class VisitorController
{
    public function getVisitors(): void
    {
        $status = $_GET['status'] ?? null;
        $date = $_GET['date'] ?? null;
        $includeArchived = ($_GET['include_archived'] ?? 'false') === 'true';

        $sql = 'SELECT * FROM visitor_logs';
        $conditions = [];
        $params = [];

        if (!$includeArchived) {
            $conditions[] = 'is_archived = 0';
        }

        if ($status) {
            $conditions[] = 'status = ?';
            $params[] = $status;
        }

        if ($date) {
            $conditions[] = 'DATE(check_in_time) = ?';
            $params[] = $date;
        }

        if ($conditions) {
            $sql .= ' WHERE ' . implode(' AND ', $conditions);
        }

        $sql .= ' ORDER BY check_in_time DESC';
        $db = Database::getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function checkIn(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $db = Database::getConnection();
        $stmt = $db->prepare(
            'INSERT INTO visitor_logs (visitor_name, contact_number, email, purpose_of_visit, person_to_visit, department, id_proof_type, id_proof_number, vehicle_number, notes, check_in_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)'    );
        $stmt->execute([
            $data['visitor_name'] ?? null,
            $data['contact_number'] ?? null,
            $data['email'] ?? null,
            $data['purpose_of_visit'] ?? null,
            $data['person_to_visit'] ?? null,
            $data['department'] ?? null,
            $data['id_proof_type'] ?? null,
            $data['id_proof_number'] ?? null,
            $data['vehicle_number'] ?? null,
            $data['notes'] ?? null,
            'checked_in',
        ]);

        http_response_code(201);
        echo json_encode(['message' => 'Visitor checked in successfully', 'id' => (int) $db->lastInsertId()]);
    }

    public function checkOut(array $params): void
    {
        $id = $params['id'];
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM visitor_logs WHERE id = ? AND status = ?');
        $stmt->execute([$id, 'checked_in']);

        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Visitor not found or already checked out']);
            return;
        }

        $stmt = $db->prepare('UPDATE visitor_logs SET check_out_time = NOW(), status = ? WHERE id = ? AND status = ?');
        $stmt->execute(['checked_out', $id, 'checked_in']);

        echo json_encode(['message' => 'Visitor checked out successfully']);
    }

    public function archiveVisitor(array $params): void
    {
        $id = $params['id'];
        $db = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM visitor_logs WHERE id = ? AND is_archived = 0');
        $stmt->execute([$id]);
        $visitor = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$visitor) {
            http_response_code(404);
            echo json_encode(['error' => 'Visitor not found or already archived']);
            return;
        }

        if ($visitor['status'] !== 'checked_out') {
            http_response_code(400);
            echo json_encode(['error' => 'Cannot archive an active visitor. Please check them out first.']);
            return;
        }

        $stmt = $db->prepare('UPDATE visitor_logs SET is_archived = 1 WHERE id = ?');
        $stmt->execute([$id]);

        echo json_encode(['message' => 'Visitor archived successfully']);
    }
}
