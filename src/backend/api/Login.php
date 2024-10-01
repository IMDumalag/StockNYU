<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

include('function.php');

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
    // Send a 200 OK response for preflight requests
    http_response_code(200);
    exit();
}

if ($requestMethod == "POST") {
    $inputData = json_decode(file_get_contents("php://input"), true);

    if (isset($inputData['user_id']) && isset($inputData['email']) && isset($inputData['password'])) {
        $userInput = [
            'user_id' => $inputData['user_id'],
            'email' => $inputData['email'],
            'password' => $inputData['password']
        ];
        $loginUser = loginUser($userInput);
        echo $loginUser;
    } else {
        $data = [
            'status' => 422,
            'message' => 'User ID, Email, and Password are required'
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