"use strict";

// Globale Variablen für die Chart.js-Instanzen (werden bei neuen Daten aktualisiert)
let zeitChart = null;
let kategorieChart = null;

// US-15: Aktuell im Balkendiagramm ausgewählte Unfallkategorie
let aktiverKategorieFilter = null;

// Platzhalter-Beispieldaten für das Grundgerüst
// TODO: Später durch echte JSON-Daten vom Backend (AJAX-Abfrage) ersetzen
const beispielUnfaelle = [
    { jahr: 2021, monat: 1, kategorie: "Unfall mit Leichtverletzten", radbeteiligung: true },
    { jahr: 2022, monat: 1, kategorie: "Unfall mit Schwerverletzten", radbeteiligung: true },
    { jahr: 2022, monat: 1, kategorie: "Unfall mit Leichtverletzten", radbeteiligung: false },
    { jahr: 2022, monat: 3, kategorie: "Unfall mit Schwerverletzten", radbeteiligung: false },
    { jahr: 2022, monat: 3, kategorie: "Unfall mit Leichtverletzten", radbeteiligung: false }
];

// Initialisierung nach dem Laden des HTML-Dokuments
document.addEventListener("DOMContentLoaded", function () {
    initStatistikenDiagramme();
});

/**
 * Initialisiert die Kennzahlen und Diagramme mit Platzhalterdaten.
 */
function initStatistikenDiagramme() {
    aktualisiereStatistikenUndDiagramme(beispielUnfaelle);
}

/**
 * Zentrale Funktion zum Aktualisieren aller Elemente von Epic E-03.
 * Kann später direkt mit den gefilterten Backend-Daten aufgerufen werden.
 */
function aktualisiereStatistikenUndDiagramme(unfallDaten) {
    updateKennzahlen(unfallDaten);
    updateZeitDiagramm(unfallDaten);
    updateKategorieDiagramm(unfallDaten);
}

/**
 * US-12: Berechnet und zeigt die drei Kennzahlen an.
 */
function updateKennzahlen(unfallDaten) {
    let gesamt = unfallDaten.length;
    let mitRad = 0;
    let mitSchwerverletzten = 0;

    for (let unfall of unfallDaten) {
        if (unfall.radbeteiligung === true) {
            mitRad = mitRad + 1;
        }
        if (unfall.kategorie === "Unfall mit Schwerverletzten") {
            mitSchwerverletzten = mitSchwerverletzten + 1;
        }
    }

    document.getElementById("kpiGesamt").textContent = gesamt;
    document.getElementById("kpiRad").textContent = mitRad;
    document.getElementById("kpiSchwerverletzte").textContent = mitSchwerverletzten;
}

/**
 * US-13: Erstellt oder aktualisiert das Zeitdiagramm (Jahr und Monat).
 * Hinweis: Platzhalter-Logik; später alle Kalendermonate inkl. 0-Werte aus Backend/Daten aufbauen.
 */
function updateZeitDiagramm(unfallDaten) {
    const monatsNamen = [
        "Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];

    // TODO: Zeitachse dynamisch für den gesamten gewählten Zeitraum (inkl. Monate mit 0 Treffern) erzeugen
    let labels = ["Januar 2021", "Januar 2022", "Februar 2022", "März 2022"];
    let werte = [0, 0, 0, 0];

    for (let unfall of unfallDaten) {
        let label = monatsNamen[unfall.monat - 1] + " " + unfall.jahr;
        let index = labels.indexOf(label);
        if (index !== -1) {
            werte[index] = werte[index] + 1;
        }
    }

    const ctx = document.getElementById("zeitDiagramm").getContext("2d");

    if (zeitChart !== null) {
        zeitChart.destroy();
    }

    zeitChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Anzahl Unfälle",
                data: werte,
                borderColor: "royalblue",
                backgroundColor: "rgba(65, 105, 225, 0.2)",
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

/**
 * US-14 & US-15: Erstellt oder aktualisiert das Balkendiagramm der Unfallkategorien.
 */
function updateKategorieDiagramm(unfallDaten) {
    const kategorien = [
        "Unfall mit Getöteten",
        "Unfall mit Schwerverletzten",
        "Unfall mit Leichtverletzten"
    ];
    let werte = [0, 0, 0];

    for (let unfall of unfallDaten) {
        let index = kategorien.indexOf(unfall.kategorie);
        if (index !== -1) {
            werte[index] = werte[index] + 1;
        }
    }

    const ctx = document.getElementById("kategorieDiagramm").getContext("2d");

    if (kategorieChart !== null) {
        kategorieChart.destroy();
    }

    kategorieChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: kategorien,
            datasets: [{
                label: "Unfälle nach Schwerekategorie",
                data: werte,
                backgroundColor: ["crimson", "darkorange", "gold"]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            // US-15: Klick auf einen Balken setzt die Kategorie als Filter
            onClick: function (event, elements) {
                if (elements.length > 0) {
                    let balkenIndex = elements[0].index;
                    let gewaehlteKategorie = kategorien[balkenIndex];
                    setzeKategorieFilter(gewaehlteKategorie);
                }
            }
        }
    });
}

/**
 * US-15: Setzt den Kategoriefilter nach einem Klick auf einen Balken.
 */
function setzeKategorieFilter(kategorie) {
    aktiverKategorieFilter = kategorie;
    document.getElementById("diagrammFilterInfo").textContent = "Aktiver Kategoriefilter: " + kategorie;
    document.getElementById("resetDiagrammFilterBtn").disabled = false;

    // TODO: Gemeinsame Filterfunktion des Dashboards aufrufen,
    // damit Karte, Tabelle, Kennzahlen und beide Diagramme aktualisiert werden.
    console.log("Diagrammfilter gesetzt:", aktiverKategorieFilter);
}

/**
 * US-15: Hebt nur den Diagrammfilter wieder auf.
 */
function resetKategorieFilter() {
    aktiverKategorieFilter = null;
    document.getElementById("diagrammFilterInfo").textContent = "Aktiver Kategoriefilter: keiner";
    document.getElementById("resetDiagrammFilterBtn").disabled = true;

    // TODO: Gemeinsame Filterfunktion des Dashboards ohne Kategoriefilter neu laden.
    console.log("Diagrammfilter entfernt.");
}
