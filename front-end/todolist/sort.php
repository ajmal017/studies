<?php
$conn;
connectMySQL();
test_sort();

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

function test_sort()
{
    global $conn;
    $i = 1;
    $query = "SELECT * FROM todo";
    $result = $conn->query($query);
    if (!$result) die("Cannot retrieve data from the database: " . $conn->error);
    for (; $i <= $result->num_rows; ++$i) {
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i != $row['id']) {
            $sortQuery = "UPDATE todo SET id=$i WHERE id=" . $row['id'];
            $sortResult = $conn->query($sortQuery);
            if (!$sortResult) die("Sorting error: " . $conn->error);
        }
    }
    $setIncrement = "ALTER TABLE todo AUTO_INCREMENT=$i";
    $setResult = $conn->query($setIncrement);
    if(!$setResult) die("Setting auto increment failed: " . $conn->error);
    echo "sorted!";
}
