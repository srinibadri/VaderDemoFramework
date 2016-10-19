
var maps = [];
var center = [35.38781, -118.99631];
var zoom = 15.5;

var layer1 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmVuZHJhZmZpbiIsImEiOiJjaXRtMmx1NGwwMGE5MnhsNG9kZGJ4bG9xIn0.trghQwlKFrdvueMDquqkJA', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
});

// var layer2 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmVuZHJhZmZpbiIsImEiOiJjaXRtMmx1NGwwMGE5MnhsNG9kZGJ4bG9xIn0.trghQwlKFrdvueMDquqkJA', {
//     maxZoom: 18,
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
//         '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//         'Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     id: 'mapbox.streets'
// });

var map1 = L.map('map1', {
    layers: [layer1],
    center: center,
    zoom: zoom
});
map1.attributionControl.setPrefix('');
// var map2 = L.map('map2', {
//     layers: [layer2],
//     center: center,
//     zoom: zoom,
//     zoomControl: false
// });

// Add each map to the map array. This will be useful for scalable calling later
maps.push(map1);
// maps.push(map2);
// maps.push(map3);

var popup = L.popup();

function onMapClick(e, map) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 1
};

var geojsonMarkerOptions = {
    radius: 9,
    fillColor: "#ee5400",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties){// && feature.properties.popupContent) {
        layer.bindPopup("<div id=\"" + feature.properties.name + "\">" + feature.properties.name + ". This is a link: <a href='#' class='seeDetailsLink'>Click me</a></div>", {className: feature.properties.name, minWidth:500});
    }
}

function pop_up(e) {
  var marker = e.popup._source;
  if(!marker) {
    return;
  }
  pop_name = marker.feature.properties.name;

  $.getJSON( "http://localhost:8000/vader/api/"+pop_name+"", function(datar) {
    // e.popup.setContent(datar).update();
    // alert(JSON.stringify(datar));
    contents = "<br><br><h3>"+marker.feature.properties.name+"</h3><br><TABLE>\
      <CAPTION>triplex_meter #1056</CAPTION>\
      <TR><TH WIDTH=\"35\" ALIGN=LEFT>Property<HR></TH>\
      <TH WIDTH=\"135\" COLSPAN=2 ALIGN=LEFT><NOBR>Line 1</NOBR><HR></TH>\
      <TH WIDTH=\"135\" COLSPAN=2 ALIGN=LEFT><NOBR>Line 2</NOBR><HR></TH>\
      <TH WIDTH=\"135\" COLSPAN=2 ALIGN=LEFT><NOBR>Neutral</NOBR><HR></TH>\
      </TR>\
      <TR><TH ALIGN=LEFT>Voltage</TH>\
      <TD ALIGN=RIGHT ><NOBR>"+datar.voltage_1+"</NOBR></TD>\
      <TD ALIGN=RIGHT ><NOBR>"+datar.voltage_2+"</NOBR></TD>\
      <TD ALIGN=RIGHT ><NOBR>"+datar.voltage_3+"</NOBR></TD>\
      <TR><TH ALIGN=LEFT>Power</TH>\
      <TD ALIGN=RIGHT ><NOBR>"+datar.power_1+"</NOBR</TD>\
      <TD ALIGN=RIGHT ><NOBR>"+datar.power_2+"</NOBR</TD>\
      <TD ALIGN=RIGHT ><NOBR>"+datar.power_3+"</NOBR</TD>\
      </TR>\
      </TABLE>";


    sparkline_contents="<br><br><div class=\"sparkline_one\">\
                  <canvas width=\"200\" height=\"60\" ></canvas></div>";

    e.popup.setContent(contents + sparkline_contents).update();

    $(".sparkline_one").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
      type: 'bar',
      height: '40',
      barWidth: 9,
      colorMap: {
        '7': '#a1a1a1'
      },
      barSpacing: 2,
      barColor: '#26B99A'
    });

  });

}

maps.forEach(function(map){
  map.on('click', function(e) {
    onMapClick(e, map);
  });
  map.on('popupopen', function(e) {
    pop_up(e);
  });
  // maps.forEach(function(syncMapTo){
  //   map.sync(syncMapTo);
  // });

});

maps.forEach(function(map){

  $.getJSON( "/static/data/model.geo.json", function(geo_json_data) {
    var myLayer = L.geoJSON(geo_json_data, {
        style: myStyle,
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
          element_num = parseInt(feature.properties.name.split("_")[1]);
          hexString = "#"+Math.min(element_num,255).toString(16) +"5400";
          geojsonMarkerOptions.fillColor = hexString;
          return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);

  });
});


console.log("Done");
