<?php
$conn;
connectMySQL();
getTableList();
getCosts();

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
    if($row[0] != 'mycash')  array_push($list, $row[0]);
  }

  return $list;
}

function getCosts()
{
  global $conn;
  $tableNames = getTableList();
  $costs = 0;
  $tableNamesLen = count($tableNames);
  for ($i = 0; $i < $tableNamesLen; $i++) {
    $query = "SELECT price, quantity FROM $tableNames[$i]";
    $result = $conn->query($query);
    if (!$result) die("Error: " . $conn->error);
    for ($j = 0; $j < $result->num_rows; $j++) {
      $row = $result->fetch_array(MYSQLI_NUM);
      $costs += floatval($row[0] * $row[1]);
    }
  }
  $json = '{"costs": "' . $costs . '"}';
  echo $json;
}
