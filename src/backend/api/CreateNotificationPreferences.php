<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

include('functionMessages.php');

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
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

   $user_id = $inputData['user_id'] ?? null;
   $item_id = $inputData['item_id'] ?? null;
   $notify_on_restock = $inputData['notify_on_restock'] ?? null;

   if (!$user_id) {
      error422('User ID is required');
   }
   if (!$item_id) {
      error422('Item ID is required');
   }
   if ($notify_on_restock === null) {
      error422('Notify on restock is required');
   }

   insertNotificationPreference($user_id, $item_id, $notify_on_restock);
} else {
   $data = [
      'status' => 405,
      'message' => $requestMethod . ' Method Not Allowed',
   ];
   header("HTTP/1.1 405 Method Not Allowed");
   echo json_encode($data);
}

?>