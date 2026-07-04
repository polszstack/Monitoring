<?php
class Response {
    public static function send($status_code, $data) {
        http_response_code($status_code);
        echo json_encode($data);
        exit();
    }

    public static function success($data, $message = "Success") {
        self::send(200, [
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }

    public static function created($data, $message = "Created successfully") {
        self::send(201, [
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }

    public static function error($message = "Error occurred", $status_code = 400) {
        self::send($status_code, [
            'success' => false,
            'message' => $message
        ]);
    }
}
?>