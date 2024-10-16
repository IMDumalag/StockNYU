<?php

require('../inc/dbcon.php');

// Function to send error response
function error422($message)
{
   $data = [
      'status' => 422,
      'message' => $message,
   ];
   header("HTTP/1.1 422 Unprocessable Entity");
   echo json_encode($data);
   exit;
}


function insertPurchaseHistory($purchase_id, $reservation_id, $user_id, $item_id, $purchase_date, $quantity_purchased, $total_price, $sold_by)
{
   global $conn;

   $query = "INSERT INTO `tbl_purchase_history` (`purchase_id`, `reservation_id`, `user_id`, `item_id`, `purchase_date`, `quantity_purchased`, `total_price`, `sold_by`, `created_at`) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, current_timestamp())";

   $stmt = $conn->prepare($query);
   if ($stmt === false) {
      error422("Error preparing the statement: " . $conn->error);
   }

   $stmt->bind_param("sssssiis", $purchase_id, $reservation_id, $user_id, $item_id, $purchase_date, $quantity_purchased, $total_price, $sold_by);

   if ($stmt->execute()) {
      $data = [
         'status' => 201,
         'message' => 'Purchase history inserted successfully',
      ];
      header("HTTP/1.1 201 Created");
      echo json_encode($data);
   } else {
      error422("Error executing the statement: " . $stmt->error);
   }

   $stmt->close();
}

function getLatestPurchaseId()
{
   global $conn;

   $query = "SELECT `purchase_id` FROM `tbl_purchase_history` ORDER BY `purchase_id` DESC LIMIT 1";
   $result = $conn->query($query);

   if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      return $row['purchase_id'];
   } else {
      return null;
   }
}
?>