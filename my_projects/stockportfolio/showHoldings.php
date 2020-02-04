<?php
$conn;
connectMySQL();
SendTableDataToJS();


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

function getTableList()
{
    global $conn;
    $list = array();
    $query = "SHOW tables";
    $result = $conn->query($query);
    if (!$result) die("Error: " . $conn->error);
    for ($i = 0; $i < $result->num_rows; ++$i) {
        $row = $result->fetch_array(MYSQLI_NUM);
        if($row[0] != 'mycash') array_push($list, $row[0]);
    }
    return $list;
}

function SendTableDataToJS()
{
    global $conn;
    $tableList = getTableList();
    if ($tableList == null) echo "null";
    else {
        $result = array();
        $tableLen = count($tableList);
        $json = "[";
        for ($i = 0; $i < $tableLen; ++$i) {
            $query = "SELECT * FROM $tableList[$i]";
            array_push($result, $conn->query($query));
        }
        for ($i = 0; $i < count($result); ++$i) {
            $previousJ = 0;
            for ($j = 0; $j < $result[$i]->num_rows; ++$j) {
                $row = $result[$i]->fetch_array(MYSQLI_ASSOC);
                if ($i > 0 && $j == 0)
                    $json .= "},";
                if ($j == 0)
                    $json .= "{\"name\": \"$tableList[$i]\", \"transaction\":[";
                if ($previousJ < $j) {
                    $json .= ",";
                    ++$previousJ;
                }
                $json .= "{\"price\":\"" . $row['price'] . "\", \"quantity\":\"" . $row['quantity'] . "\", \"date\":\"" . $row['date'] . "\"}";
                if ($result[$i]->num_rows - 1 === $j) $json .= "]";
            }
        }
        $json .= "}]";
        echo $json;
    }
}