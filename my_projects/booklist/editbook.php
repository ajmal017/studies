<?php

$conn;
connectMySQL();
editBook();

function connectMySQL() {
    global $conn;
    $hostName = "localhost";
    $userId = "201629115";
    $userPw = "201629115";
    $dbName = "books";

    $conn = new mysqli($hostName, $userId, $userPw, $dbName);
    if ($conn->connect_errno) die("Cannot Connect to MySQL: " . $conn->connect_error);
}

function editBook() {
    global $conn;
    $originalISBN = $_POST['original'];
    $title = str_replace("'", "\'", $_POST['title']);
    $author = str_replace("'", "\'", $_POST['author']);
    $category = str_replace("'", "\'", $_POST['category']);
    $isbn = str_replace("'", "\'", $_POST['isbn']);
    $query = "UPDATE booklist SET title='$title', author='$author', category='$category', isbn='$isbn'
        WHERE isbn='$originalISBN'";
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);

}