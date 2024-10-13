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
function createReservation($reservation_id, $user_id, $item_id, $reservation_date_start, $reservation_date_end, $quantity_reserved, $status, $created_at)
{
    global $conn;
    
    $query = "INSERT INTO tbl_reservations (reservation_id, user_id, item_id, reservation_date_start, reservation_date_end, quantity_reserved, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    
    if ($stmt === false) {
        error422('Prepare failed: ' . $conn->error);
    }

    // Binding the parameters
    $stmt->bind_param('sssssdss', $reservation_id, $user_id, $item_id, $reservation_date_start, $reservation_date_end, $quantity_reserved, $status, $created_at);
    
    if ($stmt->execute()) {
        $data = [
            'status' => 201,
            'message' => 'Reservation created successfully',
        ];
        echo json_encode($data);
    } else {
        error422('Execution failed: ' . $stmt->error);
    }

    $stmt->close();
}


// Function to get the latest reservation ID
function getLatestReservationId()
{
    global $conn;

    // Query to get the latest reservation_id by sorting in descending order
    $query = "SELECT `reservation_id` FROM `tbl_reservations` ORDER BY `reservation_id` DESC LIMIT 1";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['reservation_id']; // e.g., R2024-000001
    } else {
        return null; // No reservations found
    }
}

// Function to retrieve reservations by user ID
function getReservationsByUserId($user_id)
{
    global $conn;

    $query = "SELECT * FROM `tbl_reservations` WHERE `user_id` = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $reservations = [];
    while ($row = $result->fetch_assoc()) {
        $reservations[] = $row;
    }

    $stmt->close();

    return $reservations;
}

// Function to update the status of a reservation
function updateReservationStatus($reservation_id, $new_status)
{
    global $conn;

    $query = "UPDATE `tbl_reservations` SET `status` = ? WHERE `reservation_id` = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $new_status, $reservation_id);

    if ($stmt->execute()) {
        $data = [
            'status' => 200,
            'message' => 'Reservation status updated successfully',
        ];
        header("HTTP/1.1 200 OK");
        echo json_encode($data);
    } else {
        error422('Failed to update reservation status');
    }

    $stmt->close();
}

?>
