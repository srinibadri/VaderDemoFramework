

//##################### General Settings #####################

//---- Map Constants
var maps = [];
var center = [35.38781, -118.99631];
var zoom = 15.5;


//---- Data and API
var meterApiEndpoint = "/static/data/cache/meters.json",
    switchApiEndpoint = "/static/data/cache/switches.json",
    loadApiEndpoint = "/static/data/cache/load.json",
    nodeApiEndpoint = "/static/data/cache/node.json",
    houseApiEndpoint = "/static/data/cache/house.json",
    lineApiEndpoint = "/static/data/model.geo.json",
    feederApiEndpoint = "/static/data/cache/feeder.json";

var sensorApiEndpoint = "/vader/api/sensor/";
var sensor_list = [];


//
// var meterApiEndpoint = "/vader/api/meter/\*",
//     switchApiEndpoint = "/vader/api/switch/\*",
//     loadApiEndpoint = "/vader/api/load/\*",
//     nodeApiEndpoint = "/vader/api/node/\*",
//     feederApiEndpoint = "/vader/api/feeder/\*";

//---- Styles
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

var normalIconSize = 20,
    bigIconSize = 30;
var normalIconDimens = [normalIconSize, normalIconSize],
    normalIconAnchor = [normalIconSize/2, normalIconSize/2],
    normalIconPopup  = [0, -normalIconSize/2 + 3];
var bigIconDimens = [bigIconSize, bigIconSize],
    bigIconAnchor = [bigIconSize/2, bigIconSize/2],
    bigIconPopup  = [0, -bigIconSize/2 + 3];

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
var BigGridIcon = L.Icon.extend({
    options: {
      iconUrl: '/static/images/icons/switch.png',
      // shadowUrl: 'leaf-shadow.png',
      iconSize:     bigIconDimens, // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   bigIconAnchor, // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  bigIconPopup // point from which the popup should open relative to the iconAnchor
    }
});

var meterIcon = new NormalGridIcon({iconUrl: '/static/images/icons/meter.png'}),
    nodeIcon = new NormalGridIcon({iconUrl: '/static/images/icons/node.png'}),
    loadIcon = new NormalGridIcon({iconUrl: '/static/images/icons/load.png'}),
    houseIcon = new NormalGridIcon({iconUrl: '/static/images/icons/house.png'}),
    switchIcon = new BigGridIcon({iconUrl: '/static/images/icons/switch.png'});

console.log("General Settings Finished");

//##################### Layers #####################

// Base Map Layers

var Mapbox_Theme = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmVuZHJhZmZpbiIsImEiOiJjaXRtMmx1NGwwMGE5MnhsNG9kZGJ4bG9xIn0.trghQwlKFrdvueMDquqkJA', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
});

// var Thunderforest_TransportDark = L.tileLayer('http://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey={apikey}', {
// 	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// 	maxZoom: 19,
// 	apikey: '7eaba955146e49abba3989008a4d373d'
// });
//
// var Thunderforest_Landscape = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={apikey}', {
// 	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// 	apikey: '7eaba955146e49abba3989008a4d373d'
// });

var Esri_WorldStreetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

var OpenMapSurfer_Grayscale = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
	maxZoom: 19,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Theme Layers
var baseLayers = {
    "Mapbox Theme": Mapbox_Theme,
    "Esri Theme": Esri_WorldStreetMap,
    // "Thunderforest": Thunderforest_Landscape,
    // "Thunderforest 2": Thunderforest_TransportDark,
    "OpenMap Theme": OpenMapSurfer_Grayscale
};


var meterLayer = L.layerGroup([]);
var nodeLayer = L.layerGroup([]);
var loadLayer = L.layerGroup([]);
var houseLayer = L.layerGroup([]);
var switchLayer = L.layerGroup([]);
var lineLayer = L.layerGroup([]);
var lineSensorLayer = L.layerGroup([]);

// Overlay Layers
var overlayLayers = {
    "Meters": meterLayer,
    "Switches": switchLayer,
    "Nodes": nodeLayer,
    "Loads": loadLayer,
    "Lines": lineLayer,
    "Line Sensors": lineSensorLayer
};


console.log("Layers Finished");

//##################### Maps #####################


var map1 = L.map('map1', {
    layers: [Mapbox_Theme, meterLayer, nodeLayer, loadLayer, switchLayer, lineSensorLayer, lineLayer],
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



console.log("Maps Finished");

//##################### Handlers #####################


//---- Pop Up Related

var popup = L.popup();
function onMapClick(e, map) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at <br>" + e.latlng.toString())
        .openOn(map);
}

var temp, deets;
function pop_up(e) {
  if(!e) {
    return;
  }
  if(!e.popup._source) {
    return;
  }
  element_details = {}
  // Check if it is a path
  if('_path' in e.popup._source) {
    console.log("Path");
    if ('classList' in e.popup._source._path) {
      console.log("Path " + e.popup._source._path.classList);
      classes = e.popup._source._path.classList;
      for (index = 0; index < classes.length; ++index) {
        value = classes[index];
        if (value.substring(0, 4) === "line") {
             // You've found it, the full text is in `value`.
             // So you might grab it and break the loop, although
             // really what you do having found it depends on
             // what you need.
             element_details = {"type":"line", "name": value};
             break;
         }
         if (value.substring(0, 4) === "sens") {
              // You've found it, the full text is in `value`.
              // So you might grab it and break the loop, although
              // really what you do having found it depends on
              // what you need.
              element_details = {"type":"sensor", "name": value};
              break;
          }

      }
    }
  } else {
    element_details = JSON.parse(e.popup._source.getElement()['alt']);
  }
  temp = e;
  e.popup.setContent("Loading...").update();

  $.getJSON( "http://localhost:8000/vader/api/"+element_details['type']+"/"+element_details['name']+"", function(data) {
    e.popup.setContent(JSON.stringify(data)).update();
  });

  // e.popup.setContent(marker + "Updated").update();
  // pop_name = marker.feature.properties.name;
  //
  // $.getJSON( "http://localhost:8000/vader/api/"+pop_name+"", function(datar) {
  //   // e.popup.setContent(datar).update();
  //   // alert(JSON.stringify(datar));
  //   contents = "<br><br><h3>"+marker.feature.properties.name+"</h3><br><TABLE>\
  //     <CAPTION>triplex_meter #1056</CAPTION>\
  //     <TR><TH WIDTH=\"35\" ALIGN=LEFT>Property<HR></TH>\
  //     <TH WIDTH=\"135\" COLSPAN=2 ALIGN=LEFT><NOBR>Line 1</NOBR><HR></TH>\
  //     <TH WIDTH=\"135\" COLSPAN=2 ALIGN=LEFT><NOBR>Line 2</NOBR><HR></TH>\
  //     <TH WIDTH=\"135\" COLSPAN=2 ALIGN=LEFT><NOBR>Neutral</NOBR><HR></TH>\
  //     </TR>\
  //     <TR><TH ALIGN=LEFT>Voltage</TH>\
  //     <TD ALIGN=RIGHT ><NOBR>"+datar.voltage_1+"</NOBR></TD>\
  //     <TD ALIGN=RIGHT ><NOBR>"+datar.voltage_2+"</NOBR></TD>\
  //     <TD ALIGN=RIGHT ><NOBR>"+datar.voltage_3+"</NOBR></TD>\
  //     <TR><TH ALIGN=LEFT>Power</TH>\
  //     <TD ALIGN=RIGHT ><NOBR>"+datar.power_1+"</NOBR</TD>\
  //     <TD ALIGN=RIGHT ><NOBR>"+datar.power_2+"</NOBR</TD>\
  //     <TD ALIGN=RIGHT ><NOBR>"+datar.power_3+"</NOBR</TD>\
  //     </TR>\
  //     </TABLE>";
  //
  //
  //   sparkline_contents="<br><br><div class=\"sparkline_one\">\
  //                 <canvas width=\"200\" height=\"60\" ></canvas></div>";
  //
  //   e.popup.setContent(contents + sparkline_contents).update();
  //
  //   $(".sparkline_one").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
  //     type: 'bar',
  //     height: '40',
  //     barWidth: 9,
  //     colorMap: {
  //       '7': '#a1a1a1'
  //     },
  //     barSpacing: 2,
  //     barColor: '#26B99A'
  //   });
  //
  // });

}

// function onEachFeature(feature, layer) {
//     // does this feature have a property named popupContent?
//     if (feature.properties){// && feature.properties.popupContent) {
//         layer.bindPopup("<div id=\"" + feature.properties.name + "\">" + feature.properties.name + ". This is a link: <a href='#' class='seeDetailsLink'>Click me</a></div>", {className: feature.properties.name, minWidth:500});
//     }
// }


//---- Layers Related

L.Control.Watermark = L.Control.extend({
    onAdd: function(map) {
      console.log("Testing");
        var img = L.DomUtil.create('img');

        img.src = 'https://www6.slac.stanford.edu/sites/all/themes/slac_www/logo.png';
        img.style.width = '200px';

        return img;
    },

    onRemove: function(map) {
      console.log("Testing");
        // Nothing to do here
    }
});

L.control.watermark = function(opts) {
  console.log("Testing");
    return new L.Control.Watermark(opts);
}

L.control.watermark({ position: 'bottomleft' }).addTo(map1);



//---- Movement Related



//---- Coloring Related



console.log("Handlers Finished");

//##################### Controls #####################



//
// L.ClickWindowHandler = L.Handler.extend({
//     addHooks: function() {
//         L.DomEvent.on(document, 'onClick', this._doSomething, this);
//     },
//
//     removeHooks: function() {
//         L.DomEvent.off(document, 'onClick', this._doSomething, this);
//     },
//
//     _doSomething: function(event) { alert('hi') }
// });







console.log("Controls Finished");

//##################### Adding to Maps #####################

function populateLayer(endpoint, layerGroup, iconPath, element_type, priority=0) {
  $.getJSON( endpoint, function(elements, error) {
    elements.forEach(function(element) {
      if (('latitude' in element) && ('longitude' in element)) {
        latlong = [parseFloat(element['latitude']), parseFloat(element['longitude'])];
        marker = L.marker(latlong, {
          icon: iconPath,
          alt:JSON.stringify({"type":element_type,"name":element['name']})
        }).bindPopup(element['name'] + " loading..."); //.bindTooltip(element['name']);
        if (priority > 1) {
          marker.setZIndexOffset(800);
        }
        layerGroup.addLayer(marker);
      } else {
        // console.log(element['name'] + " Does Not Have Location Coordinates!!");
      }
    });
  });
}


// L.Map.addInitHook('addHandler', '', L.ClickWindowHandler);
// function al(name) {
//   alert(name);
// }

var el = [];


maps.forEach(function(map){

  // Lines sometimes have sensors. Get this list first
  $.getJSON( sensorApiEndpoint, function(sensorData) {
    if (!sensorData) { return; }
    if (sensorData['status'] == "False") { return; }
    sensor_list = sensorData;
    sensor_layers = [];
    sensor_layers_names = [];
    console.log(sensor_list);

    // Then get the list of lines
    $.getJSON( lineApiEndpoint, function(geo_json_data) {
      lineLayer.addLayer(L.geoJSON(geo_json_data,
          {filter: function(feature, layer) {return feature.geometry.type == "LineString";},
              onEachFeature: function(feature, layer) {
                  sensorName = (feature.properties.name).replace("line","sensor");
                  // console.log(sensorName);
                  if (sensor_list.indexOf(sensorName) > -1) {
                    // console.log(sensorName);
                    // layer.setStyle(myStyle);
                    sensor_layers.push(layer.toGeoJSON());
                    sensor_layers_names.push(sensorName);
                  }
                    layer.bindPopup(feature.properties.name);
                    // layer.bindTooltip(feature.properties.name);
              },
              style: function(feature) {
                return {className:(feature.properties.name)};
              }
              // classname: function(feature, layer) {
              //   JSON.stringify({"type":"line","name":feature.properties.name})
              // }
        })//.bindPopup("hi")
      )//addTo(map);
      for (i = 0; i < sensor_layers.length; ++i) {
        lineSensorLayer.addLayer(L.geoJson(sensor_layers[i], {style: function(feature) {
          return {color: "#ff7800", className:(sensor_layers_names[i])}
        }}).bindPopup(sensor_layers_names[i]));

      }

    });
  });




  populateLayer(switchApiEndpoint, switchLayer, switchIcon, "switch", priority=2);
  populateLayer(meterApiEndpoint, meterLayer, meterIcon, "meter");
  populateLayer(nodeApiEndpoint, nodeLayer, nodeIcon, "node");
  populateLayer(loadApiEndpoint, loadLayer, loadIcon, "load");

  // Houses do not have location information
  // populateLayer(houseApiEndpoint, houseLayer, houseIcon, "house");

});


maps.forEach(function(map){
  layerControl = L.control.layers(baseLayers, overlayLayers).addTo(map);
  // layerControl.addTo(map);
  map.on('click', function(e) {
    onMapClick(e, map);
  });
  map.on('popupopen', function(e) {
    pop_up(e);
  });
  // Sync to Other Maps
  // maps.forEach(function(syncMapTo){
  //   map.sync(syncMapTo);
  // });
  // map.addHandler('onClick', L.ClickWindowHandler)
});


console.log("Doneish");
