<?php
// Test database connection and login
require_once 'config/database.php';

header('Content-Type: application/json');

echo "=== Backend Test ===\n\n";

// Test 1: Database Connection
echo "1. Testing Database Connection...\n";
try {
    $database = new Database();
    $db = $database->getConnection();
    echo "✅ Database connection successful!\n\n";
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n\n";
}

// Test 2: Check users table
echo "2. Checking users table...\n";
try {
    $query = "SELECT id, username, role FROM users";
    $stmt = $db->query($query);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "✅ Users table exists. Found " . count($users) . " users:\n";
    foreach ($users as $user) {
        echo "   - {$user['username']} ({$user['role']})\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n\n";
}

// Test 3: Test password verification
echo "3. Testing admin password...\n";
try {
    $query = "SELECT password FROM users WHERE username = 'admin'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        $testPassword = 'admin123';
        if (password_verify($testPassword, $user['password'])) {
            echo "✅ Password verification works!\n\n";
        } else {
            echo "❌ Password verification failed!\n";
            echo "   Current hash: " . $user['password'] . "\n";
            
            // Create new hash
            $newHash = password_hash('admin123', PASSWORD_DEFAULT);
            echo "   New hash would be: " . $newHash . "\n\n";
        }
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n\n";
}

// Test 4: Test login process
echo "4. Testing full login process...\n";
$testData = json_encode([
    'username' => 'admin',
    'password' => 'admin123'
]);

// Simulate the login
$data = json_decode($testData);

$query = "SELECT u.*, t.id as teacher_id 
          FROM users u 
          LEFT JOIN teachers t ON u.id = t.user_id 
          WHERE u.username = :username AND u.status = 'active'";

$stmt = $db->prepare($query);
$stmt->bindParam(':username', $data->username);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "✅ User found!\n";
    echo "   User data: " . json_encode($user, JSON_PRETTY_PRINT) . "\n\n";
    
    if (password_verify($data->password, $user['password'])) {
        echo "✅ Login successful!\n";
    } else {
        echo "❌ Password incorrect!\n";
    }
} else {
    echo "❌ User not found or inactive!\n";
}

echo "\n=== End Test ===";
?>