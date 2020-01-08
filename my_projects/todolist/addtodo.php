<?php
$conn;
connectMySQL();
addContentToDB();


function connectMySQL() {
    global $conn;
    $hostName = "localhost";
    $userId = "201629115";
    $userPw = "201629115";
    $dbName = "todos";

    $conn = new mysqli($hostName, $userId, $userPw, $dbName);
    if ($conn->connect_errno) die("Cannot Connect to MySQL: " . $conn->connect_error);
}

function addContentToDB() {
    global $conn;
    $content = $_POST['content'];
    $query = "INSERT INTO todo(content, isdone) VALUES('$content', 'false')";
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);
}