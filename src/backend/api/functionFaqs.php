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

// Function to view all FAQs
function viewAllFaqs()
{
   global $conn;

   $query = "SELECT * FROM tbl_faqs";
   $result = mysqli_query($conn, $query);

   if (!$result) {
      error422("Failed to fetch FAQs");
   }

   $faqs = [];
   while ($row = mysqli_fetch_assoc($result)) {
      $faqs[] = $row;
   }

   header("Content-Type: application/json");
   echo json_encode($faqs);
   exit;
}

?>