<?php
require_once 'config/cors.php';

$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Parse the URL path
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/backend/', '', $path);
$path = trim($path, '/');

// API Routes
$routes = [
    // Authentication
    'POST api/auth/login' => 'api/auth/login.php',
    
    // Teachers
    'GET api/teachers/get-teachers' => 'api/teachers/get-teachers.php',
    
    // Schedules
    'GET api/schedules/get-teacher-schedules' => 'api/schedules/get-teacher-schedules.php',
    'POST api/schedules/create-schedule' => 'api/schedules/create-schedule.php',
    
    // Attendance
    'POST api/attendance/generate-daily-sheet' => 'api/attendance/generate-daily-sheet.php',
    'GET api/attendance/get-daily-sheet' => 'api/attendance/get-daily-sheet.php',
    'PUT api/attendance/mark-attendance' => 'api/attendance/mark-attendance.php',
    'PUT api/attendance/bulk-mark-attendance' => 'api/attendance/bulk-mark-attendance.php',
    'GET api/attendance/get-attendance-report' => 'api/attendance/get-attendance-report.php',
    
    // Visitors
    'POST api/visitors/check-in' => 'api/visitors/check-in.php',
    'PUT api/visitors/check-out' => 'api/visitors/check-out.php',
    'GET api/visitors/get-visitors' => 'api/visitors/get-visitors.php',
    
    // Facility Monitoring
    'POST api/facility/create-report' => 'api/facility/create-report.php',
    'GET api/facility/get-reports' => 'api/facility/get-reports.php',
    'PUT api/facility/update-report' => 'api/facility/update-report.php',
    'GET api/facility/get-inventory' => 'api/facility/get-inventory.php',
];

$route_key = $request_method . ' ' . $path;

if (isset($routes[$route_key])) {
    require_once $routes[$route_key];
} else {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Route not found',
        'requested_path' => $path,
        'method' => $request_method,
        'available_routes' => array_keys($routes) // Helpful for debugging
    ]);
}
?>