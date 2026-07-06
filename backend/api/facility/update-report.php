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

if (!isset($data->report_id)) {
    Response::error("Report ID is required");
}

$database = new Database();
$db = $database->getConnection();

try {
    $updateFields = [];
    $params = [':report_id' => $data->report_id];
    
    if (isset($data->status)) {
        $updateFields[] = "status = :status";
        $params[':status'] = $data->status;
        
        if ($data->status === 'fixed') {
            $updateFields[] = "fixed_date = NOW()";
        }
    }
    
    if (isset($data->priority)) {
        $updateFields[] = "priority = :priority";
        $params[':priority'] = $data->priority;
    }
    
    if (isset($data->assigned_to)) {
        $updateFields[] = "assigned_to = :assigned_to";
        $params[':assigned_to'] = $data->assigned_to;
    }
    
    if (isset($data->notes)) {
        $updateFields[] = "notes = CONCAT(IFNULL(notes, ''), '\n', :notes)";
        $params[':notes'] = "[" . date('Y-m-d H:i') . "] " . $data->notes;
    }
    
    if (isset($data->cost_estimate)) {
        $updateFields[] = "cost_estimate = :cost_estimate";
        $params[':cost_estimate'] = $data->cost_estimate;
    }
    
    if (isset($data->actual_cost)) {
        $updateFields[] = "actual_cost = :actual_cost";
        $params[':actual_cost'] = $data->actual_cost;
    }
    
    if (empty($updateFields)) {
        Response::error("No fields to update");
    }
    
    $query = "UPDATE facility_reports SET " . implode(', ', $updateFields) . " WHERE id = :report_id";
    
    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            Response::success(null, "Report updated successfully");
        } else {
            Response::error("Report not found");
        }
    } else {
        Response::error("Failed to update report");
    }
} catch (PDOException $e) {
    Response::error("Database error: " . $e->getMessage(), 500);
}
?>