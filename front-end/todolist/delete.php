<?php
$conn;
connectMySQL();
processDelete();

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

function processDelete()
{
    global $conn;
    $num = $_GET['num'];
    $query = "DELETE FROM todo WHERE id=$num";
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);
}