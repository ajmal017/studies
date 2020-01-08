<?php
$conn;
connectMySQL();
CreateNewTable();


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

function CreateNewTable() {
    global $conn;
    $ticker = $_GET['ticker'];
    $query = "CREATE TABLE $ticker(id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, price VARCHAR(16), quantity VARCHAR(16), date VARCHAR(10))";
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);
}