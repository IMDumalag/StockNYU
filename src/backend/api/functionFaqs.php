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

   $query = "SELECT f.faq_id, f.question, f.answer, f.created_by, u.f_name, u.l_name, f.created_date
          FROM tbl_faqs as f
          INNER JOIN tbl_users as u ON f.created_by = u.user_id";
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