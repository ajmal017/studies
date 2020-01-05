<?php
$conn;
connectMySQL();
getListFromDB();


function connectMySQL() {
    global $conn;
    $hostName = "localhost";
    $userId = "201629115";
    $userPw = "201629115";
    $dbName = "todos";

    $conn = new mysqli($hostName, $userId, $userPw, $dbName);
    if ($conn->connect_errno) die("Cannot Connect to MySQL: " . $conn->connect_error);
}

function getListFromDB() {
    global $conn;
    $query = "SELECT * FROM todo";
    $result = $conn->query($query);
    if($result->num_rows > 0) {
        for($i = 0; $i < $result->num_rows; ++$i) {
            $row = $result->fetch_array(MYSQLI_NUM);
            if($i === 0) echo "[";
            print <<< _END
            {"id": "$row[0]", "content": "$row[1]", "done": "$row[2]"}
        _END;
            if($i < $result->num_rows - 1) echo ",";
            else echo "]";
        }
    }
    else echo "nothing exists in the list.";
}