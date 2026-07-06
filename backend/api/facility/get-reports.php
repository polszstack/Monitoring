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
    $status = isset($_GET['status']) ? $_GET['status'] : null;
    $priority = isset($_GET['priority']) ? $_GET['priority'] : null;
    $facility_type = isset($_GET['facility_type']) ? $_GET['facility_type'] : null;
    $date_from = isset($_GET['date_from']) ? $_GET['date_from'] : null;
    $date_to = isset($_GET['date_to']) ? $_GET['date_to'] : null;
    
    $query = "SELECT fr.*, 
              u1.full_name as reporter_name,
              u2.full_name as assignee_name
              FROM facility_reports fr
              JOIN users u1 ON fr.reported_by = u1.id
              LEFT JOIN users u2 ON fr.assigned_to = u2.id
              WHERE 1=1";
    
    $params = [];
    
    if ($status) {
        $query .= " AND fr.status = :status";
        $params[':status'] = $status;
    }
    
    if ($priority) {
        $query .= " AND fr.priority = :priority";
        $params[':priority'] = $priority;
    }
    
    if ($facility_type) {
        $query .= " AND fr.facility_type = :facility_type";
        $params[':facility_type'] = $facility_type;
    }
    
    if ($date_from) {
        $query .= " AND DATE(fr.reported_date) >= :date_from";
        $params[':date_from'] = $date_from;
    }
    
    if ($date_to) {
        $query .= " AND DATE(fr.reported_date) <= :date_to";
        $params[':date_to'] = $date_to;
    }
    
    $query .= " ORDER BY 
                CASE fr.priority 
                    WHEN 'urgent' THEN 1 
                    WHEN 'high' THEN 2 
                    WHEN 'medium' THEN 3 
                    WHEN 'low' THEN 4 
                END,
                fr.reported_date DESC";
    
    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();
    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get statistics
    $statsQuery = "SELECT 
                    COUNT(*) as total_reports,
                    SUM(CASE WHEN status = 'reported' THEN 1 ELSE 0 END) as reported_count,
                    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count,
                    SUM(CASE WHEN status = 'fixed' THEN 1 ELSE 0 END) as fixed_count,
                    SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent_count,
                    SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_count
                   FROM facility_reports";
    
    $statsStmt = $db->query($statsQuery);
    $statistics = $statsStmt->fetch(PDO::FETCH_ASSOC);
    
    Response::success([
        'reports' => $reports,
        'statistics' => $statistics
    ], "Facility reports retrieved successfully");
    
} catch (PDOException $e) {
    Response::error("Database error: " . $e->getMessage(), 500);
}
?>