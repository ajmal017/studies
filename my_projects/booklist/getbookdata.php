<?php

$conn;
connectMySQL();
getBookData();

function connectMySQL() {
    global $conn;
    $hostName = "localhost";
    $userId = "201629115";
    $userPw = "201629115";
    $dbName = "books";

    $conn = new mysqli($hostName, $userId, $userPw, $dbName);
    if ($conn->connect_errno) die("Cannot Connect to MySQL: " . $conn->connect_error);
}

function getBookData() {
    global $conn;
    $isbn = $_GET['isbn'];
    $query = "SELECT * FROM booklist WHERE isbn='$isbn'";
    $result = $conn->query($query);
    if(!$result) die("Error " . $conn->error);
    $row = $result->fetch_array(MYSQLI_NUM);
    print <<< _END
        {"title": "$row[0]", "author": "$row[1]", "category": "$row[2]", "isbn": "$row[3]"}
    _END;
}