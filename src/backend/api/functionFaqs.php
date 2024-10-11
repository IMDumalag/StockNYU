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

// Function to get the latest FAQ ID and increment it
function getNextFaqId()
{
   global $conn;

   $query = "SELECT MAX(faq_id) as max_id FROM tbl_faqs";
   $result = mysqli_query($conn, $query);

   if ($result) {
      $row = mysqli_fetch_assoc($result);
      $latestFaqId = $row['max_id'];

      if ($latestFaqId) {
         // Increment the latest faq_id by 1
         return (int)$latestFaqId + 1;
      } else {
         // If no rows are found, start at 1
         return 1;
      }
   } else {
      error422("Failed to fetch the latest FAQ ID");
   }
}

// Function to insert a new FAQ
function insertFaq($question, $answer, $created_by, $created_date)
{
   global $conn;

   // Get the next faq_id by incrementing the latest one
   $faq_id = getNextFaqId();

   $query = "INSERT INTO tbl_faqs (faq_id, question, answer, created_by, created_date) VALUES (?, ?, ?, ?, ?)";
   $stmt = $conn->prepare($query);
   $stmt->bind_param("sssss", $faq_id, $question, $answer, $created_by, $created_date);

   if ($stmt->execute()) {
      $data = [
         'status' => 201,
         'message' => 'FAQ Inserted Successfully!',
         'faq_id' => $faq_id
      ];
      header("HTTP/1.1 201 Created");
      echo json_encode($data);
   } else {
      error422("Error: {$stmt->error}");
   }
}
?>
