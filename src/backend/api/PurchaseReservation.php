<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

require('functionReservations.php');

// Handle form-data or JSON input
$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
   http_response_code(200);
   exit();
}

if ($requestMethod == "POST") {
   // Detect if form-data was used
   if (!empty($_POST)) {
      // Form-data input
      $reservation_id = $_POST['reservation_id'] ?? null;
      $new_status = 'Purchased';
   } else {
      // JSON input
      $input = json_decode(file_get_contents("php://input"), true);
      $reservation_id = $input['reservation_id'] ?? null;
      $new_status = 'Purchased';
   }

   // Validate and update reservation status
   if ($reservation_id) {
      updateReservationStatus($reservation_id, $new_status);
   } else {
      error422('Invalid input');
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