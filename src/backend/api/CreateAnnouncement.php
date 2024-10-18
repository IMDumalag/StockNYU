<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

include('functionAnnouncement.php');

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

   $announcement_text = $inputData['announcement_text'] ?? null;
   $announcement_img = $inputData['announcement_img'] ?? null;
   $created_by = $inputData['created_by'] ?? null;

   if (!$announcement_text) {
      error422('Announcement text is required');
   }
   if (!$announcement_img) {
      error422('Announcement IMF is required');
   }
   if (!$created_by) {
      error422('Creator ID is required');
   }

   $created_date = date('Y-m-d H:i:s');

   insertAnnouncement($announcement_text, $announcement_img, $created_by, $created_date);
} else {
   $data = [
      'status' => 405,
      'message' => $requestMethod . ' Method Not Allowed',
   ];
   header("HTTP/1.1 405 Method Not Allowed");
   echo json_encode($data);
}

?>