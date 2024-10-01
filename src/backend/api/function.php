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

// users Table
function registerUser($userInput) {
   global $conn;

   $user_id = mysqli_real_escape_string($conn, $userInput['user_id']);
   $nu_given_identifier = mysqli_real_escape_string($conn, $userInput['nu_given_identifier']);
   $f_name = mysqli_real_escape_string($conn, $userInput['f_name']);
   $m_name = mysqli_real_escape_string($conn, $userInput['m_name']);
   $l_name = mysqli_real_escape_string($conn, $userInput['l_name']);
   $email = mysqli_real_escape_string($conn, $userInput['email']);
   $password = mysqli_real_escape_string($conn, $userInput['password']);
   $access_id = mysqli_real_escape_string($conn, $userInput['access_id']);
   $date_of_birth = mysqli_real_escape_string($conn, $userInput['date_of_birth']);
   $gender = mysqli_real_escape_string($conn, $userInput['gender']);
   $address = mysqli_real_escape_string($conn, $userInput['address']);
   $profile_picture = mysqli_real_escape_string($conn, $userInput['profile_picture']);
   $created_at = mysqli_real_escape_string($conn, $userInput['created_at']);

   if (empty(trim($user_id))) {
       return error422('Enter User ID');
   }
   else if (empty(trim($nu_given_identifier))) {
       return error422('Enter NU Given Identifier');
   }
   else if (empty(trim($f_name))) {
       return error422('Enter First Name');
   }
   else if (empty(trim($l_name))) {
       return error422('Enter Last Name');
   }
   else if (empty(trim($email))) {
       return error422('Enter Email');
   }
   else if (empty(trim($password))) {
       return error422('Enter Password');
   }
   else if (empty(trim($access_id))) {
       return error422('Enter Access ID');
   }
   else if (empty(trim($date_of_birth))) {
       return error422('Enter Date of Birth');
   }
   else if (empty(trim($gender))) {
       return error422('Enter Gender');
   }
   else if (empty(trim($address))) {
       return error422('Enter Address');
   }
   else
   {
       $query = "INSERT INTO tbl_users (user_id, nu_given_identifier, f_name, m_name, l_name, email, password, access_id, date_of_birth, gender, address, profile_picture, created_at) VALUES ('$user_id', '$nu_given_identifier', '$f_name', '$m_name', '$l_name', '$email', '$password', '$access_id', '$date_of_birth', '$gender', '$address', '$profile_picture', '$created_at')";
       $result = mysqli_query($conn, $query);

       if($result){
           $data = [
               'status' => 201,
               'message' => 'User Created Successfully!',
           ];
           header("HTTP/1.1 201 Created");
           return json_encode($data);
       }
       else{
           $data = [
               'status' => 500,
               'message' => 'Internal Server Error: ' . $conn->error,
           ];
           header("HTTP/1.1 500 Internal Server Error");
           return json_encode($data);
       }
   }
}

function getUserList() {
   global $conn;

   $query = "SELECT * FROM tbl_users";
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

function getUser($user_id) {
    global $conn;

    if (empty(trim($user_id))) {
        return error422('Enter User ID');
    }

    $user_id = mysqli_real_escape_string($conn, $user_id);

    $query = "SELECT * FROM tbl_users WHERE user_id = '$user_id' LIMIT 1";
    $result = $conn->query($query);

    if ($result) {
        if (mysqli_num_rows($result) == 1) { 
            $res = mysqli_fetch_assoc($result);

            $data = [
                'status' => 200,
                'message' => 'User Fetched Successfully!',
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

function updateUser($userInput, $userParameters) {
    global $conn;
 
    if (!isset($userParameters['user_id'])) {
        return error422('User ID Not Found');
    }
 
    $user_id = mysqli_real_escape_string($conn, $userParameters['user_id']);
    $nu_given_identifier = mysqli_real_escape_string($conn, $userInput['nu_given_identifier']);
    $f_name = mysqli_real_escape_string($conn, $userInput['f_name']);
    $m_name = mysqli_real_escape_string($conn, $userInput['m_name']);
    $l_name = mysqli_real_escape_string($conn, $userInput['l_name']);
    $email = mysqli_real_escape_string($conn, $userInput['email']);
    $password = mysqli_real_escape_string($conn, $userInput['password']);
    $access_id = mysqli_real_escape_string($conn, $userInput['access_id']);
    $date_of_birth = mysqli_real_escape_string($conn, $userInput['date_of_birth']);
    $gender = mysqli_real_escape_string($conn, $userInput['gender']);
    $address = mysqli_real_escape_string($conn, $userInput['address']);
    $profile_picture = mysqli_real_escape_string($conn, $userInput['profile_picture']);
    $created_at = mysqli_real_escape_string($conn, $userInput['created_at']);
 
    if (empty(trim($user_id))) {
        return error422('Enter User ID');
    } else if (empty(trim($nu_given_identifier))) {
        return error422('Enter NU Given Identifier');
    } else if (empty(trim($f_name))) {
        return error422('Enter First Name');
    } else if (empty(trim($l_name))) {
        return error422('Enter Last Name');
    } else if (empty(trim($email))) {
        return error422('Enter Email');
    } else if (empty(trim($password))) {
        return error422('Enter Password');
    } else if (empty(trim($access_id))) {
        return error422('Enter Access ID');
    } else if (empty(trim($date_of_birth))) {
        return error422('Enter Date of Birth');
    } else if (empty(trim($gender))) {
        return error422('Enter Gender');
    } else if (empty(trim($address))) {
        return error422('Enter Address');
    } else {
        $query = "UPDATE tbl_users SET nu_given_identifier='$nu_given_identifier', f_name='$f_name', m_name='$m_name', l_name='$l_name', email='$email', password='$password', access_id='$access_id', date_of_birth='$date_of_birth', gender='$gender', address='$address', profile_picture='$profile_picture', created_at='$created_at' WHERE user_id='$user_id'";
        $result = mysqli_query($conn, $query);
 
        if ($result) {
            $data = [
                'status' => 200,
                'message' => 'User Updated Successfully!',
            ];
            header("HTTP/1.1 200 OK");
            return json_encode($data);
        } else {
            $data = [
                'status' => 500,
                'message' => 'Internal Server Error: ' . $conn->error,
            ];
            header("HTTP/1.1 500 Internal Server Error");
            return json_encode($data);
        }
    }
 }

 function deleteUser($userInput) {
    global $conn;
 
    if (!isset($userInput['user_id'])) {
        return error422('User ID Not Found');
    }
    
    $user_id = mysqli_real_escape_string($conn, $userInput['user_id']);
    
    if (empty(trim($user_id))) {
        return error422('Enter User ID');
    }
 
    $query = "DELETE FROM tbl_users WHERE user_id='$user_id'";
    $result = mysqli_query($conn, $query);
 
    if ($result) {
        $data = [
            'status' => 200,
            'message' => 'User Deleted Successfully!',
        ];
        header("HTTP/1.1 200 OK");
        return json_encode($data);
    } else {
        $data = [
            'status' => 404,
            'message' => 'User Not Found',
        ];
        header("HTTP/1.1 404 Not Found");
        return json_encode($data);
    }
}

function loginUser($userInput) {
    global $conn;

    $user_id = mysqli_real_escape_string($conn, $userInput['user_id']);
    $email = mysqli_real_escape_string($conn, $userInput['email']);
    $password = mysqli_real_escape_string($conn, $userInput['password']);

    if (empty(trim($user_id))) {
        return error422('Enter User ID');
    } else if (empty(trim($email))) {
        return error422('Enter Email');
    } else if (empty(trim($password))) {
        return error422('Enter Password');
    } else {
        $query = "SELECT * FROM tbl_users WHERE user_id = '$user_id' AND email = '$email' LIMIT 1";
        $result = $conn->query($query);

        if ($result) {
            if ($result->num_rows == 1) {
                $user = $result->fetch_assoc();
                if (password_verify($password, $user['password'])) {
                    $data = [
                        'status' => 200,
                        'message' => 'Login Successful!',
                        'data' => $user
                    ];
                    header("HTTP/1.1 200 OK");
                    return json_encode($data);
                } else {
                    return error422('Invalid Password');
                }
            } else {
                return error422('No User Found with this User ID and Email');
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
}


?>