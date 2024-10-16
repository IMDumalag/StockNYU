<?php

header('Access-Control-Allow-Origin:*');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Request-With');

require '../inc/dbcon.php';
require '../../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\Key;

$env = parse_ini_file('../../../.env');

// Base64 URL decode function
function CheckUser()
{
    global $conn;
    global $user_id;

    // Query to check if there are any users
    $sql = "SELECT * FROM tbl_users ORDER BY user_id DESC LIMIT 1";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) == 0) {
        // If no users exist, start with the base ID
        $user_id = "USR01";
    } else {
        // If there are users, get the last inserted user_id
        $row = mysqli_fetch_assoc($result);
        $user_id = $row['user_id'];

        // Use regex to extract the prefix and numeric part
        preg_match('/([a-zA-Z]+)(\d+)/', $user_id, $matches);
        $prefix = $matches[1];
        $number = $matches[2];

        // Increment the number and format it to maintain leading zeros
        $incrementedNumber = str_pad((int) $number + 1, strlen($number), '0', STR_PAD_LEFT);
        $user_id = $prefix . $incrementedNumber;
    }
}

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
    // Send a 200 OK response for preflight requests
    http_response_code(200);
    exit();
}

if ($requestMethod == 'POST') {

    $json = file_get_contents('php://input');
    $token = json_decode($json, true);
    $tokenParts = explode(".", $token['token']);
    $header = json_decode(base64_decode($tokenParts[0]), true);
    if (isset($header['kid'])) {

        try {
            $decoded = json_decode(base64_decode($tokenParts[1]));
            $email = $decoded->email;
            $first_name = $decoded->given_name;
            $last_name = $decoded->family_name;
            $picture = $decoded->picture;
            $iss = $decoded->iss;
            $exp = $decoded->exp;
            if ($iss !== 'accounts.google.com' && $iss !== 'https://accounts.google.com') {
                $data = [
                    'status' => 401,
                    'message' => 'Unauthorized',
                ];
                header("HTTP/1.0 401 Unauthorized");
                echo json_encode($data);
                exit();
            }
            if (time() > $decoded->exp) {
                $data = [
                    'status' => 401,
                    'message' => 'Unauthorized',
                ];
                header("HTTP/1.0 401 Unauthorized");
                echo json_encode($data);
                exit();
            }

            CheckUser();
            $stmt = $conn->prepare("SELECT * FROM tbl_users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
            $isNewUser = false;

            if ($result->num_rows === 0) {
                $stmt = $conn->prepare("INSERT INTO tbl_users (user_id,email,f_name,l_name, profile_picture) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("sssss", $user_id, $email, $first_name, $last_name, $picture);
                $stmt->execute();
                $isNewUser = true;
                $stmt->close();
                $stmt = $conn->prepare("SELECT * FROM tbl_users WHERE user_id = ?");
                $stmt->bind_param("s", $user_id);
                $stmt->execute();
                $result = $stmt->get_result();
                $stmt->close();
            }
            
            $user = $result->fetch_assoc();
            $user_id = $user['user_id'];
            $email = $user['email'];
            $first_name = $user['f_name'];
            $middle_name = $user['m_name'];
            $last_name = $user['l_name'];
            $dob = $user['date_of_birth'];
            $gender = $user['gender'];
            $address = $user['address'];
            $picture = $user['profile_picture'];
            $studentnum = $user['nu_given_identifier'];
            $user_data =
                [
                    'isNewUser' => $isNewUser,
                    'email' => $email,
                    'fname' => $first_name,
                    'mname' => $middle_name,
                    'lname' => $last_name,
                    'user_id' => $user_id,
                    'studentnum' => $studentnum,
                    'dob' => $dob,
                    'gender' => $gender,
                    'address' => $address,
                    'expires_at' => $exp,
                    'profile_picture' => $picture,
                ];
            $jwt = JWT::encode($user_data, $env['VITE_REACT_JWT_SECRET'], 'HS256');
            header("HTTP/1.0 201 Created");
            $data = [
                'status' => 201,
                'message' => 'User Logged In Successfully',
                'data' => $jwt,
            ];
            echo json_encode($data);
            exit();


        } catch (ExpiredException $e) {
            $data = [
                'status' => 401,
                'message' => 'Unauthorized',
            ];
            header("HTTP/1.0 401 Unauthorized");
            echo json_encode($data);
            exit();
        }
    } else {
        $data = [
            'status' => 405,
            'message' => $requestMethod . ' Method Not Allowed',
            'additional' => $token,
        ];
        header("HTTP/1.0 405 Method Not Allowed");
        echo json_encode($data);
    }

}