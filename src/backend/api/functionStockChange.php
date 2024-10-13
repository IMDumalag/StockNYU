<?php

require '../inc/dbcon.php';

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
function createStockChange($change_id, $item_id, $user_id, $quantity_before, $quantity_added, $quantity_subtracted, $quantity_current, $note) {
   include('dbConnection.php');

   $query = "INSERT INTO `tbl_stock_change` 
       (`change_id`, `item_id`, `user_id`, `quantity_before`, `quantity_added`, `quantity_subtracted`, `quantity_current`, `note`, `created_at`) 
       VALUES 
       ('$change_id', '$item_id', '$user_id', '$quantity_before', '$quantity_added', '$quantity_subtracted', '$quantity_current', '$note', current_timestamp())";

   if (mysqli_query($conn, $query)) {
       $data = [
           'status' => 201,
           'message' => 'Stock change created successfully',
       ];
       header("HTTP/1.1 201 Created");
       echo json_encode($data);
   } else {
       $data = [
           'status' => 500,
           'message' => 'Failed to create stock change',
           'error' => mysqli_error($conn),
       ];
       header("HTTP/1.1 500 Internal Server Error");
       echo json_encode($data);
   }

   mysqli_close($conn);
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

// Function to retrieve all stock changes
function getAllStockChanges()
{
   global $conn;

   $query = "SELECT sc.change_id, sc.item_id, it.item_name, sc.user_id, us.f_name, us.l_name, sc.quantity_before, sc.quantity_added, sc.quantity_subtracted, sc.quantity_current, sc.note, sc.created_at
             FROM tbl_stock_change as sc
             INNER JOIN tbl_inventory_items as it ON sc.item_id = it.item_id
             INNER JOIN tbl_users as us ON sc.user_id = us.user_id";
   $result = $conn->query($query);

   $stock_changes = [];
   while ($row = $result->fetch_assoc()) {
      $stock_changes[] = $row;
   }

   return $stock_changes;
}

