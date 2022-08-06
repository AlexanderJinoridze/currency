<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class CurrencyModel extends Database
{
    public function getBase($base, $timestamp = null) {
        if (isset($timestamp) && $timestamp) {
            return $this->select("SELECT `" . $base . "` FROM currency_history WHERE timestamp=" . $timestamp)[0][$base];
        } else {
            return $this->select("SELECT `" . $base . "` FROM current_data")[0][$base];
        }
    }

    public function getLatest($symbols) {
        $result = $this->select("SELECT " . $symbols . " FROM current_data")[0];

        unset($result["timestamp"]);
        unset($result["id"]);
        return $result;
    }

    public function getHistorical($symbols) {
        if($symbols != "*") {
            $symbols = "timestamp," . $symbols;
        }
        $result = $this->select("SELECT " . $symbols . " FROM currency_history ORDER BY id");
        return $result;
    }

    public function getCurrency($symbols) {
        $result = $this->select("SELECT " . $symbols . " FROM currency_name")[0];

        unset($result["id"]);
        return $result;
    }

    public function getTimestamp() {
        $result = $this->select("SELECT `timestamp` FROM current_data")[0]["timestamp"];

        return $result;
    }
}