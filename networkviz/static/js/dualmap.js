

//##################### General Settings #####################

//---- Map Constants
var maps = [];
var center = [35.38781, -118.99631];
var zoom = 15.5;

var simulationList = ["ieee123","ieee123s","ieee123z","ieee123zs"];
var simulationName = "ieee123";


//---- Data and API
var meterApiEndpoint = "/static/data/cache/meters.json",
    switchApiEndpoint = "/static/data/cache/switches.json",
    loadApiEndpoint = "/static/data/cache/load.json",
    nodeApiEndpoint = "/static/data/cache/node.json",
    houseApiEndpoint = "/static/data/cache/house.json",
    lineApiEndpoint = "/static/data/model2.geo.json",
    feederApiEndpoint = "/static/data/cache/feeder.json";

var sensorApiEndpoint = "/vader/api/"+simulationName+"/sensor/",
    regionApiEndpoint = "/vader/api/"+simulationName+"/region/";
    var sensor_list = [];


//
// var meterApiEndpoint = "/vader/api/"+simulationName+"/meter/\*",
//     switchApiEndpoint = "/vader/api/"+simulationName+"/switch/\*",
//     loadApiEndpoint = "/vader/api/"+simulationName+"/load/\*",
//     nodeApiEndpoint = "/vader/api/"+simulationName+"/node/\*",
//     feederApiEndpoint = "/vader/api/"+simulationName+"/feeder/\*";

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

var Mapbox_Theme2 =
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmVuZHJhZmZpbiIsImEiOiJjaXRtMmx1NGwwMGE5MnhsNG9kZGJ4bG9xIn0.trghQwlKFrdvueMDquqkJA', {
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

var Esri_WorldStreetMap2 =
L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});



var OpenMapSurfer_Grayscale = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
	maxZoom: 19,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var OpenMapSurfer_Grayscale2 =
L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
	maxZoom: 19,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});


// Theme Layers
var baseLayers1 = {
    "Mapbox Theme": Mapbox_Theme,
    "Esri Theme": Esri_WorldStreetMap,
    // "Thunderforest": Thunderforest_Landscape,
    // "Thunderforest 2": Thunderforest_TransportDark,
    "OpenMap Theme": OpenMapSurfer_Grayscale
};

// Theme Layers
var baseLayers2 = {
    "Mapbox Theme": Mapbox_Theme2,
    "Esri Theme": Esri_WorldStreetMap2,
    // "Thunderforest": Thunderforest_Landscape2,
    // "Thunderforest 2": Thunderforest_TransportDark2,
    "OpenMap Theme": OpenMapSurfer_Grayscale2
};



// Overlay Layers as displayed on the layer chooser
var overlayLayers1 = {
    "Meters": L.layerGroup([]),
    "Switches": L.layerGroup([]),
    "Nodes": L.layerGroup([]),
    "Loads": L.layerGroup([]),
    // "Houses": L.layerGroup([]),
    "Lines": L.layerGroup([]),
    "Line Sensors": L.layerGroup([]),
    "Regions": L.layerGroup([])
};
var overlayLayers2 = {
    "Meters": L.layerGroup([]),
    "Switches": L.layerGroup([]),
    "Nodes": L.layerGroup([]),
    "Loads": L.layerGroup([]),
    // "Houses": L.layerGroup([]),
    "Lines": L.layerGroup([]),
    "Line Sensors": L.layerGroup([]),
    "Regions": L.layerGroup([])
};



console.log("Layers Finished");


//##################### Maps #####################


var map1 = L.map('map1', {
    layers: [baseLayers1["Mapbox Theme"], overlayLayers1["Meters"],
    // overlayLayers1["Nodes"], overlayLayers1["Loads"],
    overlayLayers1["Switches"], overlayLayers1["Line Sensors"], overlayLayers1["Lines"], overlayLayers1["Regions"]],
    center: center,
    zoom: zoom,
    scrollWheelZoom: false
});
map1.attributionControl.setPrefix('');
var map2 = L.map('map2', {
    layers: [baseLayers2["OpenMap Theme"],
    //overlayLayers2["Meters"],
    overlayLayers2["Nodes"],
    // overlayLayers2["Loads"],
    overlayLayers2["Switches"], overlayLayers2["Line Sensors"], overlayLayers2["Lines"], overlayLayers2["Regions"]],
    center: center,
    zoom: zoom,
    scrollWheelZoom: false,
    zoomControl: false
});


// Add each map to the map array. This will be useful for scalable calling later
maps.push({"map":map1, "base":baseLayers1, "overlay":overlayLayers1, "popup":L.popup(), "predict_state": "actual"});
maps.push({"map":map2, "base":baseLayers2, "overlay":overlayLayers2, "popup":L.popup(), "predict_state": "predicted"});
// maps.push(map3);


console.log("Maps Finished");

//##################### Handlers #####################


//---- Pop Up Related



var popup = L.popup();

function onMapClick(e, map_obj) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString());
        // .openOn(map_obj.popup);
}

// Temp is a debugging object that you can use to interrogate the popup object
var temp;

// This is the handler that gets called whenever an element is clicked on
function pop_up(e) {
  if(!e) {
    return;
  }
  if(!e.popup._source) {
    return;
  }
  element_details = {}
  // Handle the secret message passing if it is a path object
  if('_path' in e.popup._source) {
    // console.log("Path");
    if ('classList' in e.popup._source._path) {
      // console.log("Path " + e.popup._source._path.classList);
      classes = e.popup._source._path.classList;
      for (index = 0; index < classes.length; ++index) {
        value = classes[index];
        if (value.substring(0, 4) === "line") {
             // You've found it, the full text is in `value`.
             element_details = {"type":"line", "name": value};
             break;
         }
         if (value.substring(0, 4) === "sens") {
              // You've found it, the full text is in `value`.
              element_details = {"type":"sensor", "name": value};
              break;
          }

      }
      if (element_details == {}) {
        console.log("No secret message found in the class name!!");
      }
    }
  } else {
    // Handle the normal markers
    element_details = JSON.parse(e.popup._source.getElement()['alt']);
  }
  temp = e;
  e.popup.setContent("Loading...").update();

  $.getJSON( "/vader/api/"+simulationName+"/"+element_details['type']+"/"+element_details['name']+"", function(data) {
    e.popup.setContent(JSON.stringify(data['name'])).update();
  });

}



//---- Movement Related



//---- Coloring Related



console.log("Handlers Finished");


//##################### Controls #####################

//---- Layers Related

L.Control.Watermark = L.Control.extend({
    onAdd: function(map) {
      // console.log("Testing");
        var img = L.DomUtil.create('img');
        img.src = '/static/images/logo-slac.png';
        img.style.width = '200px';
        return img;
    },

    onRemove: function(map) {
      console.log("Testing Watermark remove");
        // Nothing to do here
    }
});

L.control.watermark = function(opts) {
  console.log("Testing");
    return new L.Control.Watermark(opts);
}
// Add to first map only
L.control.watermark({ position: 'bottomleft' }).addTo(map1);


console.log("Controls Finished");

//##################### Adding to Maps #####################

// Helper function for adding normal layers
function populateLayer(endpoint, layerGroup, iconPath, element_type, priority=0) {
  $.getJSON( endpoint, function(elements, error) {
    elements.forEach(function(element) {
      if (('latitude' in element) && ('longitude' in element)) {
        latlong = [parseFloat(element['latitude']), parseFloat(element['longitude'])];
        marker = L.marker(latlong, {
          icon: iconPath,
          alt:JSON.stringify({"type":element_type,"name":element['name']})
        }).bindPopup(element['name'] + " loading..."); //.bindTooltip(element['name']);
        if (priority == 1) {
          marker.setZIndexOffset(700);
        }
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

var region_colors = ['red', 'blue', 'yellow','yellow', 'red', 'green', 'green', 'green', 'orange'];
var region_colors2 =['red', 'blue', 'blue','yellow', 'red', 'green', 'green', 'green', 'orange'];


function populateRegions(endpoint, layerGroup, predict_state) {
  console.log("populateRegions");
  $.getJSON( endpoint, function(elements, error) {
    if(predict_state == "actual") {
      elements.forEach(function(element) {
        layerGroup.addLayer(L.polygon(element.points, {color: region_colors[element.group_num]}))
      });
    } else {
      elements.forEach(function(element) {
        layerGroup.addLayer(L.polygon(element.points, {color: region_colors2[element.group_num]}))
      });
    }
  });
}

// Adds each of the layers to each of the maps
maps.forEach(function(map_obj){

  // Lines sometimes have sensors. Get this list first
  map_obj.jsonPromise = $.getJSON( sensorApiEndpoint, function(sensorData) {
    if (!sensorData) { return; }
    if (sensorData['status'] == "False") { return; }
    sensor_list = sensorData;
    sensor_layers = [];
    sensor_layers_names = [];
    // console.log(sensor_list);

    // Then get the list of lines
    $.getJSON( lineApiEndpoint, function(geo_json_data) {
      map_obj.overlay["Lines"].addLayer(L.geoJSON(geo_json_data,
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
              // This style is just used as a sneaky/dumb way of
              //    communicating to the popup handler.
              style: function(feature) {
                return {className:(feature.properties.name)};
              }
        })
      )
      for (i = 0; i < sensor_layers.length; ++i) {
        map_obj.overlay["Line Sensors"].addLayer(L.geoJson(sensor_layers[i], {style: function(feature) {
          return {color: "#ff7800", className:(sensor_layers_names[i])}
        }}).bindPopup(sensor_layers_names[i]));

      }

    });
  }).error(function() {
    // Just so we have an offline demo as well
    // Then get the list of lines
    $.getJSON( lineApiEndpoint, function(geo_json_data) {
      map_obj.overlay["Lines"].addLayer(L.geoJSON(geo_json_data,
          {filter: function(feature, layer) {return feature.geometry.type == "LineString";},
              onEachFeature: function(feature, layer) {
                    layer.bindPopup(feature.properties.name);
                    // layer.bindTooltip(feature.properties.name);
              },
              // This style is just used as a sneaky/dumb way of
              //    communicating to the popup handler.
              style: function(feature) {
                return {className:(feature.properties.name)};
              }
        })
      )
    });
  });

  setTimeout(function(){ map_obj.jsonPromise.abort(); }, 2000);

  // Add each of the desired layers
  populateLayer(switchApiEndpoint, (map_obj.overlay["Switches"]), switchIcon, "switch", priority=2);
  populateLayer(meterApiEndpoint, (map_obj.overlay["Meters"]), meterIcon, "meter", priority=1);
  populateLayer(nodeApiEndpoint, (map_obj.overlay["Nodes"]), nodeIcon, "node");
  populateLayer(loadApiEndpoint, (map_obj.overlay["Loads"]), loadIcon, "load");

  populateRegions(regionApiEndpoint, (map_obj.overlay["Regions"]), map_obj.predict_state);

  console.log("Overlay meters done")


  // Houses do not have location information, so skip them
  // populateLayer(houseApiEndpoint, houseLayer, houseIcon, "house");

});


maps.forEach(function(map_obj){
  layerControl = L.control.layers(map_obj.base, map_obj.overlay).addTo(map_obj.map);
  // layerControl.addTo(map_obj.map);

  // Can't figure out how to do the map click popups, but they are annoying anyway
  // map_obj.map.on('click', function(e, map_obj) {
  //   onMapClick(e, map_obj);
  // });
  map_obj.map.on('popupopen', function(e) {
    pop_up(e);
  });
  // Sync to Other Maps
  maps.forEach(function(syncMapTo){
    map_obj.map.sync(syncMapTo.map);
  });
});


console.log("Done, but waiting on web requests");
