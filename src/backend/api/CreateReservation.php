<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

require('functionReservations.php');

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
   // Send a 200 OK response for preflight requests
   http_response_code(200);
   exit();
}

if ($requestMethod == "POST") {
   $input = json_decode(file_get_contents("php://input"), true);

   if (isset($input['reservation_id'], $input['user_id'], $input['item_id'], $input['reservation_date_start'], $input['reservation_date_end'], $input['quantity_reserved'], $input['total_reservation_price'], $input['status'])) {
      $reservation_id = $input['reservation_id'];
      $user_id = $input['user_id'];
      $item_id = $input['item_id'];
      $reservation_date_start = $input['reservation_date_start'];
      $reservation_date_end = $input['reservation_date_end'];
      $quantity_reserved = $input['quantity_reserved'];
      $total_reservation_price = $input['total_reservation_price'];
      $status = $input['status'];

      createReservation($reservation_id, $user_id, $item_id, $reservation_date_start, $reservation_date_end, $quantity_reserved, $total_reservation_price, $status);
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