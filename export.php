<?php
$verbindung = new mysqli("localhost", "root", "", "test");
if ($verbindung->connect_error) {
    die(json_encode(["error" => "Datenbankverbindung fehlgeschlagen: " . $verbindung->connect_error]));
}
if (!isset($_FILES['csv_datei']) || $_FILES['csv_datei']['error'] !== UPLOAD_ERR_OK) {
    exit('Bitte eine gültige CSV-Datei auswählen.');
}

$tmpName = $_FILES['csv_datei']['tmp_name'];
if (($handle = fopen($tmpName, 'r')) !== false) {
    
    // Optional: Erste Zeile (Kopfzeile/Überschriften) überspringen
    fgetcsv($handle, 1000, ';');

    // SQL-Befehl vorbereiten (schützt vor SQL-Injection)
    $stmt = $verbindung->prepare("INSERT INTO ");

    $zeilenImportiert = 0;

    // Alle weiteren Zeilen durchlaufen (Trennzeichen ';' ggf. auf ',' ändern)
    while (($daten = fgetcsv($handle, 1000, ';')) !== false) {
        // Leere Zeilen überspringen
        if (count($daten) < 2) continue;

        $stmt->execute([
            ':name'  => trim($daten),
            ':email' => trim($daten)
        ]);
        $zeilenImportiert++;
    }

    fclose($handle);
    echo "Erfolg! Es wurden $zeilenImportiert Datensätze importiert.";
} else {
    echo "Fehler beim Öffnen der CSV-Datei.";
}