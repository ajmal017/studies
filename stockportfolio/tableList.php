<?php
$conn;
connectMySQL();
GetExistResult();

function connectMySQL()
{
    global $conn;
    $hostName = "localhost";
    $userId = "201629115";
    $userPw = "201629115";
    $dbName = "stocks";

    $conn = new mysqli($hostName, $userId, $userPw, $dbName);
    if ($conn->connect_errno) die("Cannot Connect to MySQL: " . $conn->connect_error);
}

function CmpTableList() {
    global $conn;
    $ticker = $_GET['ticker'];
    $query = "SHOW tables";
    $result = $conn->query($query);
    if ($result->num_rows > 0) {
        for ($i = 0; $i < $result->num_rows; ++$i) {
            $row = $result->fetch_array(MYSQLI_NUM);
            if($ticker == $row[0]) return "true";
        }
        return "false";
    }
    else return "empty";
}

function GetExistResult() {
    $retVal = CmpTableList();
    echo $retVal;
}