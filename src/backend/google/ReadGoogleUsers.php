<?php

header('Access-Control-Allow-Origin:*');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Request-With');

require '../inc/dbcon.php';

function readUsers($conn) {
   $sql = "SELECT * FROM tbl_users";
   $result = mysqli_query($conn, $sql);

   $users = [];
   if (mysqli_num_rows($result) > 0) {
      while ($row = mysqli_fetch_assoc($result)) {
         $users[] = [
            'user_id' => $row['user_id'],
            'email' => $row['email'],
            'f_name' => $row['f_name'],
            'm_name' => $row['m_name'],
            'l_name' => $row['l_name'],
            'date_of_birth' => $row['date_of_birth'],
            'gender' => $row['gender'],
            'address' => $row['address'],
            'profile_picture' => $row['profile_picture'],
            'nu_given_identifier' => $row['nu_given_identifier'],
            'access_id' => $row['access_id']
         ];
      }
   }
   return $users;
}

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
   // Send a 200 OK response for preflight requests
   http_response_code(200);
   exit();
}

if ($requestMethod == 'GET') {
   $users = readUsers($conn);
   $data = [
      'status' => 200,
      'message' => 'Users Retrieved Successfully',
      'data' => $users
   ];
   echo json_encode($data);
   exit();
} else {
   $data = [
      'status' => 405,
      'message' => $requestMethod . ' Method Not Allowed'
   ];
   header("HTTP/1.0 405 Method Not Allowed");
   echo json_encode($data);
   exit();
}
?>