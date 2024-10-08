<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

require('functionReservations.php');

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
   // Send a 200 OK response for preflight requests
   http_response_code(200);
   exit();
}

if ($requestMethod == "GET") {
   if (isset($_GET['user_id'])) {
      $user_id = $_GET['user_id'];
      $reservations = getReservationsByUserId($user_id);

      if (!empty($reservations)) {
         $data = [
            'status' => 200,
            'reservations' => $reservations,
         ];
         header("HTTP/1.1 200 OK");
         echo json_encode($data);
      } else {
         $data = [
            'status' => 404,
            'message' => 'No reservations found for the given user ID',
         ];
         header("HTTP/1.1 404 Not Found");
         echo json_encode($data);
      }
   } else {
      $data = [
         'status' => 400,
         'message' => 'User ID is required',
      ];
      header("HTTP/1.1 400 Bad Request");
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