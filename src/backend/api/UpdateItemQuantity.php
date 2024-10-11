<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include('function2.php');

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
    // Send a 200 OK response for preflight requests
    http_response_code(200);
    exit();
}

if ($requestMethod == "PUT") {
    $inputData = json_decode(file_get_contents("php://input"), true);

    if (isset($inputData['item_id'], $inputData['quantity'])) {
        $item_id = $inputData['item_id'];
        $quantity = $inputData['quantity'];

        $updateInventoryQuantity = updateInventoryQuantity($item_id, $quantity);
        echo $updateInventoryQuantity;
    } else {
        error422('Item ID and quantity are required');
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