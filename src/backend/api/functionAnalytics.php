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

function getAllReservations()
{
    global $conn;

    $query = "SELECT *
    FROM tbl_reservations as r
    INNER JOIN tbl_users as u ON r.user_id =u.user_id";
    $result = $conn->query($query);

    $reservations = [];
    while ($row = $result->fetch_assoc()) {
        $reservations[] = $row;
    }

    return $reservations;
}

function getMostReservedItems()
{
    global $conn;

    $query = "SELECT r.item_id, ii.item_name, COUNT(*) as reservation_count
              FROM tbl_reservations as r
              INNER JOIN tbl_users as u ON r.user_id = u.user_id
              INNER JOIN tbl_inventory_items as ii ON r.item_id = ii.item_id
              GROUP BY r.item_id
              ORDER BY reservation_count DESC";
    $result = $conn->query($query);

    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }

    return $items;
}

function getMostCancelledReservations()
{
    global $conn;

    $query = "SELECT r.item_id, ii.item_name, COUNT(*) as cancellation_count
              FROM tbl_reservations as r
              INNER JOIN tbl_users as u ON r.user_id = u.user_id
              INNER JOIN tbl_inventory_items as ii ON r.item_id = ii.item_id
              WHERE r.status = 'CANCELLED'
              GROUP BY r.item_id
              ORDER BY cancellation_count DESC";
    $result = $conn->query($query);

    $cancelledItems = [];
    while ($row = $result->fetch_assoc()) {
        $cancelledItems[] = $row;
    }

    return $cancelledItems;
}

function getUserWithMostReservations()
{
    global $conn;

    $query = "SELECT u.f_name, u.l_name, COUNT(*) as reservation_count
              FROM tbl_reservations as r
              INNER JOIN tbl_users as u ON r.user_id = u.user_id
              INNER JOIN tbl_inventory_items as ii ON r.item_id = ii.item_id
              GROUP BY r.user_id
              ORDER BY reservation_count DESC";
    $result = $conn->query($query);

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    return $users;
}

function getUsersWithMostCancelledReservations()
{
    global $conn;

    $query = "SELECT u.f_name, u.l_name, r.status, COUNT(*) as reservation_count
              FROM tbl_reservations as r
              INNER JOIN tbl_users as u ON r.user_id = u.user_id
              INNER JOIN tbl_inventory_items as ii ON r.item_id = ii.item_id
              WHERE r.status = 'CANCELLED'
              GROUP BY r.status, r.user_id
              ORDER BY reservation_count DESC";
    $result = $conn->query($query);

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    return $users;
}
?>