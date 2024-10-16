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

   $reciever_id = $inputData['reciever_id'] ?? null;
   $message = $inputData['message'] ?? null;
   $sender_id = $inputData['sender_id'] ?? null;

   if (!$reciever_id) {
      error422('Receiver ID is required');
   }
   if (!$message) {
      error422('Message text is required');
   }
   if (!$sender_id) {
      error422('Sender ID is required');
   }

   $sent_date = date('Y-m-d H:i:s');

   insertMessage($reciever_id, $message, $sent_date, $sender_id);
} else {
   $data = [
      'status' => 405,
      'message' => $requestMethod . ' Method Not Allowed',
   ];
   header("HTTP/1.1 405 Method Not Allowed");
   echo json_encode($data);
}

?>