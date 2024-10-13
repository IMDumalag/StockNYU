<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

require('functionReservations.php');

// Handle form-data or JSON input
$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($requestMethod == "POST") {
    // Detect if form-data was used
    if (!empty($_POST)) {
        // Form-data input
        $reservation_id = $_POST['reservation_id'] ?? null;
        $user_id = $_POST['user_id'] ?? null;
        $item_id = $_POST['item_id'] ?? null;
        $reservation_date_start = $_POST['reservation_date_start'] ?? null;
        $reservation_date_end = $_POST['reservation_date_end'] ?? null;
        $quantity_reserved = $_POST['quantity_reserved'] ?? null;
        $status = $_POST['status'] ?? null;
        $created_at = date('Y-m-d H:i:s'); // Auto-generate the created_at timestamp

    } else {
        // JSON input
        $input = json_decode(file_get_contents("php://input"), true);
        $reservation_id = $input['reservation_id'] ?? null;
        $user_id = $input['user_id'] ?? null;
        $item_id = $input['item_id'] ?? null;
        $reservation_date_start = $input['reservation_date_start'] ?? null;
        $reservation_date_end = $input['reservation_date_end'] ?? null;
        $quantity_reserved = $input['quantity_reserved'] ?? null;
        $status = $input['status'] ?? null;
        $created_at = date('Y-m-d H:i:s'); // Auto-generate the created_at timestamp
    }

    // Validate and create reservation
    if ($reservation_id && $user_id && $item_id && $reservation_date_start && $reservation_date_end && $quantity_reserved && $status) {
        createReservation($reservation_id, $user_id, $item_id, $reservation_date_start, $reservation_date_end, $quantity_reserved, $status, $created_at);
    } else {
        error422('Invalid input');
    }
} else {
    $data = [
        'status' => 405,
        'message' => $requestMethod . ' Method Not Allowed',
    ];
    header("HTTP/1.1 405 Method Not Allowed");
    echo json_encode($data);
}

?>
