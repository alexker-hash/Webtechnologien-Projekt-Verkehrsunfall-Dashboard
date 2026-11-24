let markerLayer = null;  // global definierter Layer
function initMap() {
    map = L.map('mymap', {
        center: [50, 8],
        zoom: 14
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);  // global definierter Layer

    initMarkers();
    return map;
}
var blueMarker;
var greenMarker;
var yellowMarker;
var redMarker;

var features = [];


function initMarkers() {



    greenMarker = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    yellowMarker = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    redMarker = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

}
function showDashMarker(myData, map) {

    console.log("jetzt in showDashMarker");

    var markerType = yellowMarker; // Default

    if (myData.dringlichkeit > 2) markerType = greenMarker;
    if (myData.dringlichkeit < 2) markerType = redMarker;



    var marker = new L.marker([myData.latitude, myData.longitude], {
        clickable: true,
        icon: markerType
    }).bindPopup(
        // TODO: Hier die richtigen Feldnamen aus der Datenbank einfügen
        '<p><b>' + myData.name + '</b><br>' +
        'Kategorie: ' + myData.kategorie + '<br>' +
        'Dringlichkeit: ' + myData.dringlichkeit + '<br>' +
        'Beschreibung: ' + myData.beschreibung + '</p>'
    ).addTo(markerLayer);

    features.push(marker);


}
function fitBounds() {
    if (map) {
        let group = new L.featureGroup(features);
        map.fitBounds(group.getBounds());
    }

}
function showMarker(myData, map) {

    ;

    var markerType = yellowMarker; // Default
// TODO: Hier die richtigen Feldnamen aus der Datenbank einfügen
    if (myData.dringlichkeit > 2) markerType = greenMarker;
    if (myData.dringlichkeit < 2) markerType = redMarker;

    var marker = new L.marker([myData.latitude, myData.longitude], {
        clickable: true,
        icon: markerType
    }).bindPopup(
        // TODO: Hier die richtigen Feldnamen aus der Datenbank einfügen
        '<p><b>' + myData.kundename + '</b><br>' +
        'Kategorie: ' + myData.kategorie + '<br>' +
        'Dringlichkeit: ' + myData.dringlichkeit + '<br>' +
        'Beschreibung: ' + myData.problembeschreibung + '</p>'
    ).addTo(markerLayer);

    features.push(marker);
    fitBounds();
}
