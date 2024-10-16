<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With");

require('functionPurchaseHistory.php');

// Handle form-data or JSON input
$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
   http_response_code(200);
   exit();
}

if ($requestMethod == "POST") {
   // Initialize reservation_id to null by default
   $reservation_id = null;

   // Detect if form-data was used
   if (!empty($_POST)) {
      // Form-data input
      $purchase_id = $_POST['purchase_id'] ?? null;
      $reservation_id = $_POST['reservation_id'] ?? null;
      $user_id = $_POST['user_id'] ?? null;
      $item_id = $_POST['item_id'] ?? null;
      $purchase_date = $_POST['purchase_date'] ?? null;
      $quantity_purchased = $_POST['quantity_purchased'] ?? null;
      $total_price = $_POST['total_price'] ?? null;
      $sold_by = $_POST['sold_by'] ?? null;

   } else {
      // JSON input
      $input = json_decode(file_get_contents("php://input"), true);
      $purchase_id = $input['purchase_id'] ?? null;
      $reservation_id = $input['reservation_id'] ?? null;
      $user_id = $input['user_id'] ?? null;
      $item_id = $input['item_id'] ?? null;
      $purchase_date = $input['purchase_date'] ?? null;
      $quantity_purchased = $input['quantity_purchased'] ?? null;
      $total_price = $input['total_price'] ?? null;
      $sold_by = $input['sold_by'] ?? null;
   }

   // Validate and create purchase history
   if ($purchase_id && $user_id && $item_id && $purchase_date && $quantity_purchased && $total_price && $sold_by) {
      insertPurchaseHistory($purchase_id, $reservation_id, $user_id, $item_id, $purchase_date, $quantity_purchased, $total_price, $sold_by);
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