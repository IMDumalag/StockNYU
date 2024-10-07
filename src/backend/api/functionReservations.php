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

// Function to handle reservation creation
function createReservation($reservation_id, $user_id, $item_id, $reservation_date_start, $reservation_date_end, $quantity_reserved, $total_reservation_price, $status)
{
    global $conn;

    $query = "INSERT INTO `tbl_reservations` (`reservation_id`, `user_id`, `item_id`, `reservation_date_start`, `reservation_date_end`, `quantity_reserved`, `total_reservation_price`, `status`) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssssidss", $reservation_id, $user_id, $item_id, $reservation_date_start, $reservation_date_end, $quantity_reserved, $total_reservation_price, $status);

    if ($stmt->execute()) {
        $data = [
            'status' => 201,
            'message' => 'Reservation created successfully',
        ];
        header("HTTP/1.1 201 Created");
        echo json_encode($data);
    } else {
        error422('Failed to create reservation');
    }

    $stmt->close();
}

// Function to get the latest reservation ID
function getLatestReservationId()
{
    global $conn;

    $query = "SELECT `reservation_id` FROM `tbl_reservations` ORDER BY `created_at` DESC LIMIT 1";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['reservation_id'];
    } else {
        return null;
    }
}
?>