var geo_json_data = "";

var data;
var node_size = 110;
var mymap = L.map('energy-map').setView([35.38881, -118.99131], 15.5);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoiYmVuZHJhZmZpbiIsImEiOiJjaXRtMnM3cjUwMGY2MnRwY3loODYybm02In0.b4HQeNWffCU4Q0CE6gynMw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}
mymap.on('click', onMapClick);

console.log("Done");

d3.json("/static/networkviz/cmugrid.json", function(error, json) {
    console.log(json);
    data = json.features;

    data.forEach(function(d) {
      tmp = L.circle(d.geometry.coordinates, node_size, {
          color: 'green',
          fillColor: '#f03',
          fillOpacity: 0.5
      }).addTo(mymap);

      prop = d.properties;
      tmp.bindPopup(prop.popupContent +
      "<br><table style='width:90%; padding:5px; border: 1px solid black;    border-collapse: collapse;'>" +
      "<tr><td>"+ "name"+"</td><td>"+  prop.name +"</td></tr>" +
      "<tr><td>"+ "phases"+"</td><td>"+ prop.phases +"</td></tr>" +
      "<tr><td>"+ "voltage_A" + "</td><td>"+ prop.voltage_A +"</td></tr>" +
      "<tr><td>"+ "voltage_B" +"</td><td>"+ prop.voltage_B +"</td></tr>" +
      "<tr><td>"+ "voltage_C" +"</td><td>"+ prop.voltage_C +"</td></tr>" +
      "</table><br><br>  <button type='button' class='btn btn-info btn-sm' data-toggle='modal' data-target='#myModal'>See More</button>");
    })
});
console.log("Done");

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

var geojsonMarkerOptions = {
    radius: 2,
    fillColor: "#ee5400",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};


$.getJSON( "/static/data/model.geo.json", function( datar) {
  geo_json_data = datar;
  var myLayer = L.geoJSON(geo_json_data, {
      style: myStyle,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      }
  }).addTo(mymap);

});


// myLayer.addData(geo_json_data);
console.log("Dofdsfsdne");
