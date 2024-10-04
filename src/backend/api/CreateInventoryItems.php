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

   if (isset($inputData['item_id'], $inputData['item_name'], $inputData['item_image'], $inputData['description'], $inputData['quantity'], $inputData['price'], $inputData['reservation_price_perday'], $inputData['status'])) {
      $item_id = $inputData['item_id'];
      $item_name = $inputData['item_name'];
      $item_image = $inputData['item_image'];
      $description = $inputData['description'];
      $quantity = $inputData['quantity'];
      $price = $inputData['price'];
      $reservation_price_perday = $inputData['reservation_price_perday'];
      $status = $inputData['status'];

      $insertInventoryItem = insertInventoryItem($item_id, $item_name, $item_image, $description, $quantity, $price, $reservation_price_perday, $status);
      echo $insertInventoryItem;
   } else {
      error422('All fields are required');
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