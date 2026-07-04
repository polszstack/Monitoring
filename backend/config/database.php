<?php
class Database {
    private $host = "localhost";
    private $db_name = "school_management";
    private $username = "root";
    private $password = "";
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Connection error: " . $e->getMessage()]);
            exit();
        }

        return $this->conn;
    }
}
?>