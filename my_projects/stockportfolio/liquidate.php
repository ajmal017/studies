<?php
$conn;
connectMySQL();
liquidatePosition();


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

function liquidatePosition() {
    global $conn;
    $ticker = $_GET['ticker'];
    $query = "DROP TABLE $ticker";
    print($ticker);
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);
}