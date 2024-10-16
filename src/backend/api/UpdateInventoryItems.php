<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

include('function2.php');

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($requestMethod == "PUT") {
    $inputData = json_decode(file_get_contents("php://input"), true);

    if (empty($inputData)) {
        $data = [
            'status' => 400,
            'message' => 'No data provided',
        ];
        header("HTTP/1.1 400 Bad Request");
        echo json_encode($data);
        exit();
    }

    if (isset($inputData['item_id'], $inputData['item_name'], $inputData['item_image'], $inputData['description'], $inputData['quantity'], $inputData['price'], $inputData['status'])) {
        $updateItem = updateInventoryItem(
            $inputData['item_id'],
            $inputData['item_name'],
            $inputData['item_image'],
            $inputData['description'],
            $inputData['quantity'],
            $inputData['price'],
            $inputData['status']
        );
        echo $updateItem;
    } else {
        $data = [
            'status' => 422,
            'message' => 'Invalid input data',
        ];
        header("HTTP/1.1 422 Unprocessable Entity");
        echo json_encode($data);
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
