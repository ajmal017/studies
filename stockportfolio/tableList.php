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

function CmpTableList()
{
    global $conn;
    $ticker = $_GET['ticker'];
    $query = "SHOW tables";
    $result = $conn->query($query);
    for ($i = 0; $i < $result->num_rows; ++$i) {
        $row = $result->fetch_array(MYSQLI_NUM);
        if ($ticker == $row[0]) return "true";
    }
    return "false";
}

function GetExistResult()
{
    $retVal = CmpTableList();
    echo $retVal;
}
