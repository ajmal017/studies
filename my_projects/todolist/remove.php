<?php
$conn;
connectMySQL();
removeItem();

function connectMySQL() {
    global $conn;
    $hostName = "localhost";
    $userId = "201629115";
    $userPw = "201629115";
    $dbName = "todos";

    $conn = new mysqli($hostName, $userId, $userPw, $dbName);
    if ($conn->connect_errno) die("Cannot Connect to MySQL: " . $conn->connect_error);
}

function removeItem() {
    global $conn;
    $itemId = $_GET['id'];
    $query = "DELETE FROM todo WHERE id=$itemId";
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);
}