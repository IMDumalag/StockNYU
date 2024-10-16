<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

require('functionPurchaseHistory.php');

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
   http_response_code(200);
   exit();
}

if ($requestMethod == "GET") {
   $latestPurchaseId = getLatestPurchaseId(); // Get the latest purchase_id

   if ($latestPurchaseId !== null) {
      $data = [
         'status' => 200,
         'latest_purchase_id' => $latestPurchaseId, // Return the latest purchase_id directly
      ];
      header("HTTP/1.1 200 OK");
      echo json_encode($data);
   } else {
      $data = [
         'status' => 404,
         'message' => 'No purchase history found',
      ];
      header("HTTP/1.1 404 Not Found");
      echo json_encode($data);
   }
}
?>