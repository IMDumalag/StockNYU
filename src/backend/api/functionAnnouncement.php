<?php

require('../inc/dbcon.php');

// Function to send error response
function error422($message) {
    $data = [
         'status' => 422,
         'message' => $message,
    ];
    header("HTTP/1.1 422 Unprocessable Entity");
    echo json_encode($data);
    exit;
}

// Function to get the next announcement ID
function getNextAnnouncementId()
{
   global $conn;

   $query = "SELECT MAX(announcement_id) as max_id FROM tbl_announcement";
   $result = mysqli_query($conn, $query);

   if ($result) {
      $row = mysqli_fetch_assoc($result);
      $latestAnnouncementId = $row['max_id'];

      return ($latestAnnouncementId) ? (int)$latestAnnouncementId + 1 : 1;
   } else {
      error422("Failed to fetch the latest announcement ID");
   }
}

// Function to insert a new announcement
function insertAnnouncement($annoucement_text, $annoucement_img, $created_by, $created_date)
{
   global $conn;

   // Get the next announcement_id
   $announcement_id = getNextAnnouncementId();

   $query = "INSERT INTO tbl_announcement (announcement_id, annoucement_text, annoucement_img, created_by, created_date) VALUES (?, ?, ?, ?, ?)";
   $stmt = $conn->prepare($query);
   $stmt->bind_param("issss", $announcement_id, $annoucement_text, $annoucement_img, $created_by, $created_date);

   if ($stmt->execute()) {
      $data = [
         'status' => 201,
         'message' => 'Announcement Inserted Successfully!',
         'announcement_id' => $announcement_id
      ];
      header("HTTP/1.1 201 Created");
      echo json_encode($data);
   } else {
      error422("Error: {$stmt->error}");
   }
}

?>
