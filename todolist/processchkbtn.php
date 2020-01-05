<?php
$conn;
connectMySQL();
if($_GET['done'] == 'true') {
    moveToDone();
} else {
    moveToUndone();
}


function connectMySQL() {
    global $conn;
    $hostName = "localhost";
    $userId = "201629115";
    $userPw = "201629115";
    $dbName = "todos";

    $conn = new mysqli($hostName, $userId, $userPw, $dbName);
    if ($conn->connect_errno) die("Cannot Connect to MySQL: " . $conn->connect_error);
}

function moveToDone() {
    global $conn;
    $itemId = $_GET['id'];
    $query = "UPDATE todo SET isdone='true' WHERE id='$itemId'";
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);
}

function moveToUndone() {
    global $conn;
    $itemId = $_GET['id'];
    $query = "UPDATE todo SET isdone='false' WHERE id='$itemId'";
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);
}