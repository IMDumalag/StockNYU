<?php

header('Access-Control-Allow-Origin:*');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Request-With');

require '../inc/dbcon.php';

function updateAccessId($conn, $user_id, $new_access_id) {
   $stmt = $conn->prepare("UPDATE tbl_users SET access_id = ? WHERE user_id = ?");
   $stmt->bind_param("ss", $new_access_id, $user_id);
   $stmt->execute();
   $affected_rows = $stmt->affected_rows;
   $stmt->close();
   return $affected_rows > 0;
}

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
   // Send a 200 OK response for preflight requests
   http_response_code(200);
   exit();
}

if ($requestMethod == 'POST') {
   $json = file_get_contents('php://input');
   $data = json_decode($json, true);

   if (isset($data['user_id']) && isset($data['new_access_id'])) {
      $user_id = $data['user_id'];
      $new_access_id = $data['new_access_id'];

      if (updateAccessId($conn, $user_id, $new_access_id)) {
         $response = [
            'status' => 200,
            'message' => 'Access ID updated successfully'
         ];
         echo json_encode($response);
      } else {
         $response = [
            'status' => 400,
            'message' => 'Failed to update Access ID'
         ];
         echo json_encode($response);
      }
   } else {
      $response = [
         'status' => 400,
         'message' => 'Invalid input'
      ];
      echo json_encode($response);
   }
} else {
   $response = [
      'status' => 405,
      'message' => $requestMethod . ' Method Not Allowed'
   ];
   header("HTTP/1.0 405 Method Not Allowed");
   echo json_encode($response);
   exit();
}
?>