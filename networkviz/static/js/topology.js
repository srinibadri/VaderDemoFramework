
var maps = [];
var center = [35.39001, -119.00131];
var zoom = 17;



var normalIconSize = 20,
    bigIconSize = 30,
    megaIconSize = 60;
var normalIconDimens = [normalIconSize, normalIconSize],
    normalIconAnchor = [normalIconSize/2, normalIconSize/2],
    normalIconPopup  = [0, -normalIconSize/2 + 3];
var NormalGridIcon = L.Icon.extend({
    options: {
      iconUrl: '/static/images/icons/meter.png',
      // shadowUrl: 'leaf-shadow.png',
      iconSize:     normalIconDimens, // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   normalIconAnchor, // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  normalIconPopup // point from which the popup should open relative to the iconAnchor
    }
});


var meterIcon = new NormalGridIcon({iconUrl: '/static/images/icons/meter.png'}),
    nodeIcon = new NormalGridIcon({iconUrl: '/static/images/icons/node.png'}),
    loadIcon = new NormalGridIcon({iconUrl: '/static/images/icons/load.png'}),
    houseIcon = new NormalGridIcon({iconUrl: '/static/images/icons/house.png'}),
    switchIcon = new NormalGridIcon({iconUrl: '/static/images/icons/switch.png'});

console.log("General Settings Finished");







var layer1 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmVuZHJhZmZpbiIsImEiOiJjaXRtMmx1NGwwMGE5MnhsNG9kZGJ4bG9xIn0.trghQwlKFrdvueMDquqkJA', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
});

var layer2 = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
	maxZoom: 19,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});


// var layer2 =
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmVuZHJhZmZpbiIsImEiOiJjaXRtMmx1NGwwMGE5MnhsNG9kZGJ4bG9xIn0.trghQwlKFrdvueMDquqkJA', {
//     maxZoom: 18,
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
//         '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//         'Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     id: 'mapbox.streets'
// });

var map1 = L.map('map1', {
    layers: [layer1],
    center: center,
    zoom: zoom,
    scrollWheelZoom: false
});
map1.attributionControl.setPrefix('');
var map2 = L.map('map2', {
    layers: [layer2],
    center: center,
    zoom: zoom,
    zoomControl: true,
    scrollWheelZoom: false
});

// Add each map to the map array. This will be useful for scalable calling later
maps.push(map1);
maps.push(map2);
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

var myStyle2 = {
    "color": "#009aee",
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
        layer.bindPopup("<div id=\"" + feature.properties.name + "\">" + feature.properties.name + "", {className: feature.properties.name, minWidth:50});
    }
}

function pop_up(e) {
  var marker = e.popup._source;
  if(!marker) {
    return;
  }
  pop_name = marker.feature.properties.name;

  $.getJSON( "http://localhost:8000/vader/api/"+simulationName+"/"+pop_name+"", function(datar) {
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
  // map.on('click', function(e) {
  //   onMapClick(e, map);
  // });
  // map.on('popupopen', function(e) {
  //   pop_up(e);
  // });
  maps.forEach(function(syncMapTo){
    map.sync(syncMapTo);
  });

});

// maps.forEach(function(map){

//   $.getJSON( "/static/data/model2.geo.json", function(geo_json_data) {
//     var myLayer = L.geoJSON(geo_json_data, {
//         style: myStyle,
//         onEachFeature: onEachFeature,
//         pointToLayer: function (feature, latlng) {
//           element_num = parseInt(feature.properties.name.split("_")[1]);
//           hexString = "#"+Math.min(element_num,255).toString(16) +"5400";
//           geojsonMarkerOptions.fillColor = hexString;
//           return L.circleMarker(latlng, geojsonMarkerOptions);
//         }
//     }).addTo(map);

//   });
// });


// load model 1

$.getJSON( "/static/data/model_visualization.geo.json", function(geo_json_data) {
  var myLayer = L.geoJSON(geo_json_data, {
      style: myStyle,
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        element_num = parseInt(feature.properties.name.split("_")[1]);
        hexString = "#"+Math.min(element_num,255).toString(16) +"5400";
        geojsonMarkerOptions.fillColor = hexString;
        marker = L.marker(latlng, {
          icon: meterIcon,
        }).bindPopup(feature.properties.name + " loading..."); //.bindTooltip(element['name']);
        return marker;
      },
  }).addTo(map1);

});

// load model 2

// $.getJSON( "/static/data/model2.geo.json", function(geo_json_data) {
//   var myLayer = L.geoJSON(geo_json_data, {
//       style: myStyle2,
//       onEachFeature: onEachFeature,
//       pointToLayer: function (feature, latlng) {
//         element_num = parseInt(feature.properties.name.split("_")[1]);
//         hexString = "#"+Math.min(element_num,255).toString(16) +"5400";
//         geojsonMarkerOptions.fillColor = hexString;
//         return L.circleMarker(latlng, geojsonMarkerOptions);
//       }
//   }).addTo(map2);

// });

var map2Layer;
var addMap2 = function(geo_json_data){
    map2Layer = L.geoJSON(geo_json_data, {
      style: myStyle2,
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        element_type = feature.properties.name.split("_")[1];
        element_num = parseInt(feature.properties.name.split("_")[1]);
        hexString = "#"+Math.min(element_num,255).toString(16) +"5400";
        geojsonMarkerOptions.fillColor = hexString;
        markerIcon = meterIcon;
        if (element_type == "meter") { markerIcon = meterIcon }
        else if (element_type == "load") { markerIcon = loadIcon }

        marker = L.marker(latlng, {
          icon: meterIcon,
        }).bindPopup(feature.properties.name + " loading..."); //.bindTooltip(element['name']);
        return marker;
      }
  }).addTo(map2);
};

var removeMap2 = function(){
  map2Layer.remove();
};


console.log("Done");
