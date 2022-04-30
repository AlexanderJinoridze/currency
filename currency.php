<?php
    // $time_start = microtime(true);
    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname = "currency";
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) { die("Connection failed: " . $conn->connect_error); }
    $lastUpdate = mysqli_fetch_array($conn->query("SELECT `timestamp` FROM `current_data`"))[0];
    $currentTime = strtotime(date("Y-m-d H:00:00"));
    if($lastUpdate != $currentTime) {
        $json = file_get_contents('https://openexchangerates.org/api/latest.json?app_id=132e1eff7e2041888ba589a056785f27');
        $data = json_decode($json);
        $timestamp = $data->timestamp;
        $posts = array();
        $rates_code = array();
        $rates_data = array();
        $update_query_data = array();
        $isTimestampUnique = true;
        $result = $conn->query("SELECT `timestamp` FROM `currency_history`");
        foreach ($data->rates as $key => $value) {
            array_push($rates_code, "`" . $key . "`");
            array_push($rates_data, $value);
            array_push($update_query_data, "`" . $key . "`" . " = " . $value);
        }
        while ($row = mysqli_fetch_array($result)) {
            $posts[] = $row;
        }
        foreach ($posts as $row) {
            if ($row[0] == $timestamp) {
                $isTimestampUnique = false;
                break;
            }
        }
        if (mysqli_fetch_array($conn->query("SELECT COUNT(*) FROM currency_history"))[0] >= 24) {
            $conn->query("DELETE FROM currency_history WHERE id=" . mysqli_fetch_array($conn->query("SELECT id FROM currency_history ORDER BY id"))[0]);
        }
        if ($isTimestampUnique) {
            $conn->query("UPDATE `current_data` SET `timestamp`=" . $timestamp . ", " . strtolower(implode(', ', $update_query_data)));
            $conn->query("INSERT INTO `currency_history` ( timestamp, " . strtolower(implode(', ', $rates_code)) . ") VALUES (" . $timestamp . ", " . implode(', ', $rates_data) . ")");
        }
    }
    $conn->close();
    // $time_end = microtime(true);
    // $time = $time_end - $time_start;
    // echo "$time seconds\n";