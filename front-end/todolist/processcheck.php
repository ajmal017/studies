<?php
$conn;
connectMySQL();
if($_GET['checked'] == "t") moveToDone();
else if($_GET['checked'] == "f") moveToUndone();
function connectMySQL()
{
    global $conn;
    $hostName = "localhost";
    $userId = "201629115";
    $userPw = "201629115";
    $dbName = "todos";

    $conn = new mysqli($hostName, $userId, $userPw, $dbName);
    if ($conn->connect_errno) die("Cannot Connect to MySQL: " . $conn->connect_error);
} // end of function connectMySQL()

function moveToDone() {
    global $conn;
    $num = $_GET['num'];
    $query = "UPDATE todo SET isdone='true' WHERE id=$num";
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);
}

function moveToUndone() {
    global $conn;
    $num = $_GET['num'];
    $query = "UPDATE todo SET isdone='false' WHERE id=$num";
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);
}