<?php

$conn;
connectMySQL();
deleteBook();

function connectMySQL() {
    global $conn;
    $hostName = "localhost";
    $userId = "201629115";
    $userPw = "201629115";
    $dbName = "books";

    $conn = new mysqli($hostName, $userId, $userPw, $dbName);
    if ($conn->connect_errno) die("Cannot Connect to MySQL: " . $conn->connect_error);
}

function deleteBook() {
    global $conn;
    $isbn = $_GET['isbn'];
    $query = "DELETE FROM booklist WHERE isbn='$isbn'";
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);
    echo "successfully deleted!";
}