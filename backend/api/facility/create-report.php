<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

$user = Auth::validateToken();

$data = json_decode(file_get_contents("php://input"));

$required_fields = ['facility_type', 'item_name', 'location', 'priority'];
foreach ($required_fields as $field) {
    if (!isset($data->$field) || empty($data->$field)) {
        Response::error("$field is required");
    }
}

$database = new Database();
$db = $database->getConnection();

try {
    // Generate report number
    $report_number = 'FR-' . date('Ymd') . '-' . rand(1000, 9999);
    
    $query = "INSERT INTO facility_reports (
                report_number, facility_type, item_name, item_description,
                location, room_number, priority, reported_by, notes
              ) VALUES (
                :report_number, :facility_type, :item_name, :item_description,
                :location, :room_number, :priority, :reported_by, :notes
              )";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':report_number', $report_number);
    $stmt->bindParam(':facility_type', $data->facility_type);
    $stmt->bindParam(':item_name', $data->item_name);
    $stmt->bindParam(':item_description', $data->item_description);
    $stmt->bindParam(':location', $data->location);
    $stmt->bindParam(':room_number', $data->room_number);
    $stmt->bindParam(':priority', $data->priority);
    $stmt->bindParam(':reported_by', $user['user_id']);
    $stmt->bindParam(':notes', $data->notes);
    
    if ($stmt->execute()) {
        $report_id = $db->lastInsertId();
        
        // Update inventory if item exists
        if (isset($data->item_code)) {
            $updateInventory = "UPDATE facility_inventory 
                               SET condition_status = 'broken' 
                               WHERE item_code = :item_code";
            $invStmt = $db->prepare($updateInventory);
            $invStmt->bindParam(':item_code', $data->item_code);
            $invStmt->execute();
        }
        
        $reportData = [
            'id' => $report_id,
            'report_number' => $report_number,
            'facility_type' => $data->facility_type,
            'item_name' => $data->item_name,
            'priority' => $data->priority,
            'status' => 'reported',
            'reported_date' => date('Y-m-d H:i:s')
        ];
        
        Response::created($reportData, "Facility report created successfully");
    } else {
        Response::error("Failed to create facility report");
    }
} catch (PDOException $e) {
    Response::error("Database error: " . $e->getMessage(), 500);
}
?>