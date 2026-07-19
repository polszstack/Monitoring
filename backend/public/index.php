<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\AuthController;
use App\Controllers\AttendanceController;
use App\Controllers\FacilityController;
use App\Controllers\ScheduleController;
use App\Controllers\TeacherController;
use App\Controllers\VisitorController;
use App\Middleware\AuthMiddleware;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Access-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$path = preg_replace('#^' . preg_quote($scriptName) . '#', '', $path);
$path = trim($path, '/');

// Support frontend proxy and direct access via /api prefix
if (str_starts_with($path, 'api/')) {
    $path = substr($path, 4);
}

$segments = explode('/', $path);

$method = $_SERVER['REQUEST_METHOD'];

$routes = [
    'POST' => [
        'auth/login' => ['controller' => AuthController::class, 'action' => 'login', 'auth' => false],
        'facility/reports' => ['controller' => FacilityController::class, 'action' => 'addReport', 'auth' => true],
        'schedules' => ['controller' => ScheduleController::class, 'action' => 'createScheduleTemplate', 'auth' => true],
        'schedules/generate-attendance' => ['controller' => ScheduleController::class, 'action' => 'generateAttendance', 'auth' => true],
        'attendance/bulk-archive' => ['controller' => AttendanceController::class, 'action' => 'bulkArchive', 'auth' => true],
        'attendance/:id/archive' => ['controller' => AttendanceController::class, 'action' => 'toggleArchive', 'auth' => true],
        'attendance/:id/verify-present' => ['controller' => AttendanceController::class, 'action' => 'verifyPresent', 'auth' => true],
        'facility/reports/archive-daily' => ['controller' => FacilityController::class, 'action' => 'archiveDailyReports', 'auth' => true],
        'visitors/check-in' => ['controller' => VisitorController::class, 'action' => 'checkIn', 'auth' => true],
    ],
    'GET' => [
        'auth/profile' => ['controller' => AuthController::class, 'action' => 'profile', 'auth' => true],
        'facility/stats' => ['controller' => FacilityController::class, 'action' => 'getStats', 'auth' => true],
        'facility/reports' => ['controller' => FacilityController::class, 'action' => 'getReports', 'auth' => true],
        'teachers' => ['controller' => TeacherController::class, 'action' => 'getAllTeachers', 'auth' => true],
        'schedules' => ['controller' => ScheduleController::class, 'action' => 'getScheduleTemplates', 'auth' => true],
        'visitors' => ['controller' => VisitorController::class, 'action' => 'getVisitors', 'auth' => true],
    ],
    'PUT' => [
        'teachers/:id' => ['controller' => TeacherController::class, 'action' => 'updateTeacher', 'auth' => true, 'admin' => true],
        'attendance/:id' => ['controller' => AttendanceController::class, 'action' => 'markAttendance', 'auth' => true],
        'attendance/bulk' => ['controller' => AttendanceController::class, 'action' => 'bulkMarkAttendance', 'auth' => true],
        'attendance/:id/archive' => ['controller' => AttendanceController::class, 'action' => 'toggleArchive', 'auth' => true],
        'facility/reports/:id' => ['controller' => FacilityController::class, 'action' => 'updateReportStatus', 'auth' => true],
        'facility/reports/:id/archive' => ['controller' => FacilityController::class, 'action' => 'toggleArchiveReport', 'auth' => true],
        'visitors/:id/check-out' => ['controller' => VisitorController::class, 'action' => 'checkOut', 'auth' => true],
        'visitors/:id/archive' => ['controller' => VisitorController::class, 'action' => 'archiveVisitor', 'auth' => true],
    ],
];

if ($method === 'GET' && preg_match('#^attendance/date/([^/]+)$#', $path, $matches)) {
    $controller = new AttendanceController();
    $controller->getAttendanceByDate(['date' => $matches[1]]);
    exit;
}

if ($method === 'GET' && preg_match('#^teachers/([^/]+)$#', $path, $matches)) {
    $controller = new TeacherController();
    $controller->getTeacher(['id' => $matches[1]]);
    exit;
}

$matched = false;
foreach ($routes[$method] ?? [] as $route => $routeInfo) {
    $pattern = '#^' . str_replace(':id', '([^/]+)', preg_quote($route, '#')) . '$#';
    if (preg_match($pattern, $path, $matches)) {
        $matched = true;
        $params = [];
        if (strpos($route, ':id') !== false) {
            $params['id'] = $matches[1];
        }

        $controllerClass = $routeInfo['controller'];
        $action = $routeInfo['action'];
        $controller = new $controllerClass();

        if ($routeInfo['auth'] ?? true) {
            $user = AuthMiddleware::authenticate();
            if ($routeInfo['admin'] ?? false) {
                AuthMiddleware::authorizeAdmin($user);
            }
        }

        if ($params) {
            $controller->$action($params);
        } else {
            $controller->$action();
        }
        exit;
    }
}

if (!$matched) {
    http_response_code(404);
    echo json_encode(['error' => 'Route not found']);
}
