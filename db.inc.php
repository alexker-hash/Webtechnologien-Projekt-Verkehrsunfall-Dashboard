<?php

$server = "localhost";
$user = "root";
$pass = "";
$db = "test";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $verbindung = new mysqli($server, $user, $pass, $db);
    $verbindung->set_charset("utf8mb4");
} catch (mysqli_sql_exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    exit("Konnte Verbindung zur Datenbank nicht herstellen!");
}

return $verbindung;