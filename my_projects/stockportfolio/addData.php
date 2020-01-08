<?php
$conn;
connectMySQL();
addData();


function connectMySQL()
{
    global $conn;
    $hostName = "localhost";
    $userId = "201629115";
    $userPw = "201629115";
    $dbName = "stocks";

    $conn = new mysqli($hostName, $userId, $userPw, $dbName);
    if ($conn->connect_errno) die("Cannot Connect to MySQL: " . $conn->connect_error);
}

function addData() {
    global $conn;
    $ticker = $_POST['ticker'];
    $price = $_POST['price'];
    $quantity = $_POST['quantity'];
    $date = $_POST['date'];
    $query = "INSERT INTO $ticker(price, quantity, date) VALUES('$price', '$quantity', '$date')";
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);
}