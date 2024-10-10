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

// Function to handle stock change creation
function createStockChange($change_id, $item_id, $user_id, $quantity, $note, $created_at)
{
   global $conn;

   $query = "INSERT INTO `tbl_stock_change` (`change_id`, `item_id`, `user_id`, `quantity`, `note`, `created_at`) 
           VALUES (?, ?, ?, ?, ?, ?)";

   $stmt = $conn->prepare($query);
   $stmt->bind_param("ssssss", $change_id, $item_id, $user_id, $quantity, $note, $created_at);

   if ($stmt->execute()) {
      $data = [
         'status' => 201,
         'message' => 'Stock change recorded successfully',
      ];
      header("HTTP/1.1 201 Created");
      echo json_encode($data);
   } else {
      error422('Failed to record stock change');
   }

   $stmt->close();
}

// Function to get the latest stock change ID
function getLatestStockChangeId()
{
   global $conn;

   // Query to get the latest change_id by sorting in descending order
   $query = "SELECT `change_id` FROM `tbl_stock_change` ORDER BY `change_id` DESC LIMIT 1";
   $result = $conn->query($query);

   if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      return $row['change_id']; // e.g., SC-00001
   } else {
      return null; // No stock changes found
   }
}

// Function to retrieve stock changes by item ID
function getStockChangesByItemId($item_id)
{
   global $conn;

   $query = "SELECT * FROM `tbl_stock_change` WHERE `item_id` = ?";
   $stmt = $conn->prepare($query);
   $stmt->bind_param("s", $item_id);
   $stmt->execute();
   $result = $stmt->get_result();

   $stock_changes = [];
   while ($row = $result->fetch_assoc()) {
      $stock_changes[] = $row;
   }

   $stmt->close();

   return $stock_changes;
}

?>
