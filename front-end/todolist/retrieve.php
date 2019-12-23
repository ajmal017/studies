<?php
$conn;
connectMySQL();
retrieveList();

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

function retrieveList()
{
    global $conn;
    $query = "SELECT * FROM todo";
    $result = $conn->query($query);
    if(!$result) die("Error: " . $conn->error);
    for($i = 1; $i <= $result->num_rows; ++$i) {
        $row = $result->fetch_array(MYSQLI_NUM);
        if($i == 1) echo "[";
        print <<< _END
            {"content": "$row[1]", "done": "$row[2]"}
        _END;
        if($i < $result->num_rows) echo ",";
        else echo "]";
    }
}