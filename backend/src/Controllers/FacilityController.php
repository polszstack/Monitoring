<?php

namespace App\Controllers;

use App\Config\Database;
use PDO;

class FacilityController
{
    public function getStats(): void
    {
        $db = Database::getConnection();
        $stmt = $db->query('SELECT COUNT(*) as totalReports FROM facility_reports WHERE is_archived = 0');
        $total = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmt = $db->query("SELECT COUNT(*) as pendingReports FROM facility_reports WHERE status = 'reported' AND is_archived = 0");
        $pending = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'totalReports' => (int) $total['totalReports'],
            'pendingReports' => (int) $pending['pendingReports'],
        ]);
    }

    public function getReports(): void
    {
        $includeArchived = ($_GET['include_archived'] ?? 'false') === 'true';
        $sql = 'SELECT fr.*, u.full_name as reporter_name FROM facility_reports fr LEFT JOIN users u ON fr.reported_by = u.id';

        if (!$includeArchived) {
            $sql .= ' WHERE fr.is_archived = 0';
        }

        $sql .= ' ORDER BY fr.priority DESC, fr.reported_date DESC';
        $db = Database::getConnection();
        $stmt = $db->query($sql);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function addReport(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $db = Database::getConnection();
        $reportNumber = 'REP-' . random_int(100000, 999999);
        $reporterId = 1;

        $stmt = $db->prepare(
            'INSERT INTO facility_reports (report_number, item_name, facility_type, item_description, location, room_number, priority, notes, reported_by, reported_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())'
        );
        $stmt->execute([
            $reportNumber,
            $data['item_name'] ?? null,
            $data['facility_type'] ?? null,
            $data['item_description'] ?? null,
            $data['location'] ?? null,
            $data['room_number'] ?? null,
            $data['priority'] ?? 'medium',
            $data['notes'] ?? null,
            $reporterId,
        ]);

        http_response_code(201);
        echo json_encode(['message' => 'Report logged successfully']);
    }

    public function updateReportStatus(array $params): void
    {
        $id = $params['id'];
        $data = json_decode(file_get_contents('php://input'), true);
        $status = $data['status'] ?? null;

        if (!$status) {
            http_response_code(400);
            echo json_encode(['error' => 'status is required']);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE facility_reports SET status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);

        echo json_encode(['message' => 'Report status updated']);
    }

    public function toggleArchiveReport(array $params): void
    {
        $id = $params['id'];
        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE facility_reports SET is_archived = NOT is_archived WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Report archival toggled']);
    }

    public function archiveDailyReports(): void
    {
        $db = Database::getConnection();
        $db->exec("UPDATE facility_reports SET is_archived = 1 WHERE status IN ('fixed', 'cannot_fix', 'cancelled') AND is_archived = 0");
        echo json_encode(['message' => 'Daily log cleanup complete']);
    }
}
