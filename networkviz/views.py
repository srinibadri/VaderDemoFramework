from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(request):
    return HttpResponse("""
<html>
<head>
 <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.0-rc.3/dist/leaflet.css" />
 <script src="https://unpkg.com/leaflet@1.0.0-rc.3/dist/leaflet.js"></script>

<style>
    #mapid { height: 80%; }
</style>

</head>
<body>

<h1>Map Demo</h1>

<div id="mapid"></div>

<script>
    var mymap = L.map('mapid').setView([37.42573, -122.1896], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'mapbox.streets'
		}).addTo(mymap);

var circle = L.circle([37.42573, -122.1896], 500, {
    color: 'green',
    fillColor: '#ff3',
    fillOpacity: 0.5
}).addTo(mymap);

circle.bindPopup("SLAC (power quality is good)");

var circle2 = L.circle([37.42403, -122.1716], 500, {
    color: 'green',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(mymap);

circle2.bindPopup("Lake Lag (flooding caused power outage)");



        var popup = L.popup();

		function onMapClick(e) {
			popup
				.setLatLng(e.latlng)
				.setContent("You clicked the map at " + e.latlng.toString())
				.openOn(mymap);
		}

		mymap.on('click', onMapClick);


</script>

</body>
</html>


    """)
