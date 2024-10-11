<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

include('functionStockChange.php');

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
   // Send a 200 OK response for preflight requests
   http_response_code(200);
   exit();
}

if ($requestMethod == "POST") {
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

   $change_id = $inputData['change_id'] ?? null;
   $item_id = $inputData['item_id'] ?? null;
   $user_id = $inputData['user_id'] ?? null;
   $quantity = $inputData['quantity'] ?? null;
   $note = $inputData['note'] ?? null;
   $created_at = $inputData['created_at'] ?? null;

   if (!$change_id || !$item_id || !$user_id || !$quantity || !$created_at) {
      error422('Missing required fields');
   }

   createStockChange($change_id, $item_id, $user_id, $quantity, $note, $created_at);
} else {
   $data = [
      'status' => 405,
      'message' => $requestMethod . ' Method Not Allowed',
   ];
   header("HTTP/1.1 405 Method Not Allowed");
   echo json_encode($data);
}

?>