<?php

$conn;
connectMySQL();
addBooks();

function connectMySQL() {
    global $conn;
    $hostName = "localhost";
    $userId = "201629115";
    $userPw = "201629115";
    $dbName = "books";

    $conn = new mysqli($hostName, $userId, $userPw, $dbName);
    if ($conn->connect_errno) die("Cannot Connect to MySQL: " . $conn->connect_error);
}

function addBooks() {
    global $conn;
    $title = str_replace("'", "\'", $_POST['title']);
    $author = str_replace("'", "\'", $_POST['author']);
    $category = str_replace("'", "\'", $_POST['category']);
    $isbn = str_replace("'", "\'", $_POST['isbn']);
    $query = "INSERT INTO booklist(title, author, category, isbn) VALUES('$title', '$author', '$category', '$isbn')";
    $result = $conn->query($query);

    if(!$result) die("Error: " . $conn->error);

}