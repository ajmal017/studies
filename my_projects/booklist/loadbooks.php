<?php

$conn;
connectMySQL();
loadBooks();

function connectMySQL() {
    global $conn;
    $hostName = "localhost";
    $userId = "201629115";
    $userPw = "201629115";
    $dbName = "books";

    $conn = new mysqli($hostName, $userId, $userPw, $dbName);
    if ($conn->connect_errno) die("Cannot Connect to MySQL: " . $conn->connect_error);
}

function loadBooks() {
    global $conn;
    $query = "SELECT * FROM booklist";
    $result = $conn->query($query);
    $numRows = mysqli_num_rows($result);
    if($numRows > 0) {
        $numCols = mysqli_num_fields($result);
        for($i = 0; $i < $numRows; ++$i) {
            $row = $result->fetch_array(MYSQLI_NUM);
            for($j = 0; $j < $numCols; ++$j) {
                $row[$j] = str_replace('"', '\"', $row[$j]);
            }
            if($i === 0) echo "[";
            print <<< _END
            {"title": "$row[0]", "author": "$row[1]", "category": "$row[2]", "isbn": "$row[3]"}
        _END;
            if($i < $result->num_rows - 1) echo ",";
            else echo "]";
        }
    }
    else echo "nothing exists in the list.";

}