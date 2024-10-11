<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

include('functionFaqs.php');

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

   $question = $inputData['question'] ?? null;
   $answer = $inputData['answer'] ?? null;
   $created_by = $inputData['created_by'] ?? null;

   if (!$question) {
      error422('Question is required');
   }
   if (!$answer) {
      error422('Answer is required');
   }
   if (!$created_by) {
      error422('Creator ID is required');
   }

   $created_date = date('Y-m-d H:i:s');

   insertFaq($question, $answer, $created_by, $created_date);
} else {
   $data = [
      'status' => 405,
      'message' => $requestMethod . ' Method Not Allowed',
   ];
   header("HTTP/1.1 405 Method Not Allowed");
   echo json_encode($data);
}

?>
