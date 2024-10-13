<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

include('function2.php');

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

   $item_id = $inputData['item_id'] ?? null;
   $item_name = $inputData['item_name'] ?? null;
   $item_image = $inputData['item_image'] ?? null;
   $description = $inputData['description'] ?? null;
   $quantity = $inputData['quantity'] ?? null;
   $price = $inputData['price'] ?? null;
   $status = $inputData['status'] ?? null;

   if (!$item_id || !$item_name || !$item_image || !$description || !$quantity || !$price || !$status) {
      $data = [
         'status' => 422,
         'message' => 'All fields are required',
      ];
      header("HTTP/1.1 422 Unprocessable Entity");
      echo json_encode($data);
      exit();
   }

   $insertItem = insertInventoryItem($item_id, $item_name, $item_image, $description, $quantity, $price, $status);
   echo $insertItem;
} else {
   $data = [
      'status' => 405,
      'message' => $requestMethod . ' Method Not Allowed',
   ];
   header("HTTP/1.1 405 Method Not Allowed");
   echo json_encode($data);
}

?>
