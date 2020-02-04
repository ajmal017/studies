<?php
$conn;
connectMySQL();
getCash();

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

function getCash()
{
  global $conn;
  $query = "SELECT quantity, date FROM mycash";
  $result = $conn->query($query);
  $json = "[";
  if (!$result) die("Error: " . $conn->error);
  $numRow = $result->num_rows;
  for ($i = 0; $i < $numRow; $i++) {
    $row = $result->fetch_array(MYSQLI_NUM);
    $json .= '{"qty": "' . $row[0] . '", "date": "' . $row[1] . '"}';
    if ($i < $numRow - 1) 
      $json .= ",";
  }
  $json .= "]";
  echo $json;
}
