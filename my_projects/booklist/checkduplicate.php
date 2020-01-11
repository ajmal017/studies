<?php

$conn;
connectMySQL();
checkDuplicate();

function connectMySQL() {
    global $conn;
    $hostName = "localhost";
    $userId = "201629115";
    $userPw = "201629115";
    $dbName = "books";

    $conn = new mysqli($hostName, $userId, $userPw, $dbName);
    if ($conn->connect_errno) die("Cannot Connect to MySQL: " . $conn->connect_error);
}

function checkDuplicate() {
    global $conn;
    $isbn = $_GET['isbn'];
    $query = "SELECT isbn FROM booklist";
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);
    for($i = 0; $i < $result->num_rows; ++$i) {
        $row = $result->fetch_array(MYSQLI_NUM);
        if($row[0] == $isbn) echo "duplicated";
    }
}