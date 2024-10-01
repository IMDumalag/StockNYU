<?php

require ('../inc/dbcon.php');
require ('../inc/dbcon2.php');

// errors
function error422($message) {
   $data = [
       'status' => 422,
       'message' => $message,
   ];
   header("HTTP/1.1 422 Unprocessable Entity");
   echo json_encode($data);
   exit;
}

function getImageList() {
   global $conn;

   $query = "SELECT * FROM images";
   $query_run = $conn->query($query);

   if ($query_run) {
       if ($query_run->num_rows > 0) {
           $res = $query_run->fetch_all(MYSQLI_ASSOC);

           $data = [
               'status' => 200,
               'message' => 'User List Fetched Successfully!',
               'data' => $res
           ];
           header("HTTP/1.1 200 OK");
           return json_encode($data);
       } else {
           $data = [
               'status' => 404,
               'message' => 'No record found',
           ];
           header("HTTP/1.1 404 Not Found");
           return json_encode($data);
       }
   } else {
       $data = [
           'status' => 500,
           'message' => 'Internal Server Error: ' . $conn->error,
       ];
       header("HTTP/1.1 500 Internal Server Error");
       return json_encode($data);
   }
}

?>