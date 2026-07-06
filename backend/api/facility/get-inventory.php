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
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    $condition = isset($_GET['condition']) ? $_GET['condition'] : null;
    $location = isset($_GET['location']) ? $_GET['location'] : null;
    
    $query = "SELECT * FROM facility_inventory WHERE 1=1";
    $params = [];
    
    if ($category) {
        $query .= " AND category = :category";
        $params[':category'] = $category;
    }
    
    if ($condition) {
        $query .= " AND condition_status = :condition";
        $params[':condition'] = $condition;
    }
    
    if ($location) {
        $query .= " AND location LIKE :location";
        $params[':location'] = "%$location%";
    }
    
    $query .= " ORDER BY category, item_name";
    
    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();
    $inventory = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    Response::success($inventory, "Inventory retrieved successfully");
    
} catch (PDOException $e) {
    Response::error("Database error: " . $e->getMessage(), 500);
}
?>