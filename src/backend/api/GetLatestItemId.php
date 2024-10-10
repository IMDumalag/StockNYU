<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

require('function2.php');

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
   // Send a 200 OK response for preflight requests
   http_response_code(200);
   exit();
}

if ($requestMethod == "GET") {
   $latestItemId = getLatestItemId();  // Assume this function fetches the plain latest item ID

   if ($latestItemId !== null) {
      $data = [
         'status' => 200,
         'latest_item_id' => $latestItemId, // No need to decode anything
      ];
      header("HTTP/1.1 200 OK");
      echo json_encode($data);
   } else {
      $data = [
         'status' => 404,
         'message' => 'No items found',
      ];
      header("HTTP/1.1 404 Not Found");
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
