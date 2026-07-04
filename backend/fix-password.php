<?php
require_once 'config/database.php';

echo "=== Password Fix Tool ===\n\n";

$database = new Database();
$db = $database->getConnection();

try {
    // Create a proper password hash
    $newPassword = 'admin123';
    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
    
    echo "New hash: " . $newHash . "\n\n";
    
    // Update admin password
    $query = "UPDATE users SET password = :password WHERE username = 'admin'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':password', $newHash);
    
    if ($stmt->execute()) {
        echo "✅ Admin password updated!\n\n";
    } else {
        echo "❌ Failed to update password\n";
        exit;
    }
    
    // Verify
    $verifyQuery = "SELECT username, password FROM users WHERE username = 'admin'";
    $verifyStmt = $db->query($verifyQuery);
    $user = $verifyStmt->fetch(PDO::FETCH_ASSOC);
    
    echo "Verification:\n";
    echo "Username: " . $user['username'] . "\n";
    echo "New stored hash: " . $user['password'] . "\n";
    
    $verifyResult = password_verify('admin123', $user['password']);
    echo "Password verify test: " . ($verifyResult ? "✅ SUCCESS" : "❌ FAILED") . "\n\n";
    
    if ($verifyResult) {
        echo "You can now login with:\n";
        echo "Username: admin\n";
        echo "Password: admin123\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Database Error: " . $e->getMessage() . "\n";
}
?>