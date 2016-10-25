

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
    lineApiEndpoint = "/static/data/model2.geo.json",
    substationApiEndpoint = "/static/data/cache/substations.json";

var switchConfigFileEndpoint = "/static/data/switch_data/";
// var switchConfigFileEndpoint = "/vader/api/switch/state/";
var sensorApiEndpoint = "/vader/api/sensor/",
    regionApiEndpoint = "/vader/api/region/";
var sensor_list = [];

var ignoreList = ["sw61to6101", "node_6101", "line60to61", "node_610", "node_61"];

var monitoredList = ["sw13to152","sw151to300","sw450to451","sw95to195"];

var switchStateList = {"sw15001to149":"OPEN","sw250to251":"OPEN","sw300to350":"OPEN","sw450to451":"OPEN","sw95to195":"OPEN","sw13to152":"OPEN","sw18to135":"OPEN","sw60to160":"OPEN","sw61to6101":"OPEN","sw97to197":"OPEN","sw54to94":"OPEN","sw151to300":"OPEN"};
var switchStateList2 = {"sw15001to149":"OPEN","sw250to251":"OPEN","sw300to350":"OPEN","sw450to451":"OPEN","sw95to195":"OPEN","sw13to152":"OPEN","sw18to135":"OPEN","sw60to160":"OPEN","sw61to6101":"OPEN","sw97to197":"OPEN","sw54to94":"OPEN","sw151to300":"OPEN"};

var switchConfigsUrls = ["RT_configs.csv",
      "15M_configs.csv", "30M_configs.csv",
      "1HR_configs.csv", "2HR_configs.csv",
      "3HR_configs.csv", "5HR_configs.csv",
      "1D_configs.csv",  "2D_configs.csv"];

var switchMarkerList = [];
var switchConfigs = [{},{},{},{},{},{},{},{},{}];
var currentConfig = 0;
var currentTime = 0;
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
    bigIconSize = 30,
    megaIconSize = 60;
var normalIconDimens = [normalIconSize, normalIconSize],
    normalIconAnchor = [normalIconSize/2, normalIconSize/2],
    normalIconPopup  = [0, -normalIconSize/2 + 3];
var bigIconDimens = [bigIconSize, bigIconSize],
    bigIconAnchor = [bigIconSize/2, bigIconSize/2],
    bigIconPopup  = [0, -bigIconSize/2 + 3];
var megaIconDimens = [megaIconSize, megaIconSize],
    megaIconAnchor = [megaIconSize/2, megaIconSize/2],
    megaIconPopup  = [0, -megaIconSize/2 + 3];

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
var MegaGridIcon = L.Icon.extend({
    options: {
      iconUrl: '/static/images/icons/substation.png',
      // shadowUrl: 'leaf-shadow.png',
      iconSize:     megaIconDimens, // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   megaIconAnchor, // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  megaIconPopup // point from which the popup should open relative to the iconAnchor
    }
});


var meterIcon = new NormalGridIcon({iconUrl: '/static/images/icons/meter.png'}),
    nodeIcon = new NormalGridIcon({iconUrl: '/static/images/icons/node.png'}),
    loadIcon = new NormalGridIcon({iconUrl: '/static/images/icons/load.png'}),
    houseIcon = new NormalGridIcon({iconUrl: '/static/images/icons/house.png'}),
    switchIcon = new BigGridIcon({iconUrl: '/static/images/icons/switch.png'}),
    switchIconUnmonitored = new BigGridIcon({iconUrl: '/static/images/icons/switch-unmonitored.png'}),
    switchIconUnmonitoredOpen = new BigGridIcon({iconUrl: '/static/images/icons/switch-unmonitored-open.png'}),
    switchIconUnmonitoredClosed = new BigGridIcon({iconUrl: '/static/images/icons/switch-unmonitored-closed.png'}),

    switchIconMonitored = new BigGridIcon({iconUrl: '/static/images/icons/switch-monitored.png'}),
    switchIconMonitoredClosed = new BigGridIcon({iconUrl: '/static/images/icons/switch-monitored-closed.png'}),
    switchIconMonitoredOpen = new BigGridIcon({iconUrl: '/static/images/icons/switch-monitored-open.png'}),
    switchIconClosed = new BigGridIcon({iconUrl: '/static/images/icons/switch-monitored-closed.png'}),
    switchIconOpen = new BigGridIcon({iconUrl: '/static/images/icons/switch-monitored-open.png'}),

    substationIcon = new MegaGridIcon({iconUrl: '/static/images/icons/substation.png'});

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
    "Substations": L.layerGroup([]),
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
    "Substations": L.layerGroup([]),
    "Regions": L.layerGroup([])
};



console.log("Layers Finished");


//##################### Maps #####################


var map1 = L.map('map1', {
    layers: [baseLayers1["Mapbox Theme"],
    overlayLayers1["Meters"],
    // overlayLayers1["Nodes"],
    overlayLayers1["Loads"],
    overlayLayers1["Switches"],
    overlayLayers1["Line Sensors"],
    overlayLayers1["Lines"],
    overlayLayers1["Substations"],
    overlayLayers1["Regions"]
    ],
    center: center,
    zoom: zoom,
    scrollWheelZoom: false
});
map1.attributionControl.setPrefix('');
var map2 = L.map('map2', {
    layers: [baseLayers2["OpenMap Theme"],
    //overlayLayers2["Meters"],
    // overlayLayers2["Nodes"],
    // overlayLayers2["Loads"],
    overlayLayers2["Switches"],
    // overlayLayers2["Line Sensors"],
    overlayLayers2["Lines"],
    overlayLayers2["Substations"],
    overlayLayers2["Regions"]
    ],
    center: center,
    zoom: zoom,
    scrollWheelZoom: false,
    zoomControl: false
});


// Add each map to the map array. This will be useful for scalable calling later
maps.push({"map":map1, "base":baseLayers1, "overlay":overlayLayers1, "popup":L.popup(), "predict_state": "actual", "switches":[], "regions":[], switchStateList });
maps.push({"map":map2, "base":baseLayers2, "overlay":overlayLayers2, "popup":L.popup(), "predict_state": "predicted", "switches":[], "regions":[], "switchStateList": switchStateList2 });
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

  $.getJSON( "/vader/api/"+element_details['type']+"/"+element_details['name']+"", function(data) {
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
      // We want to ignore a few elements
      if (ignoreList.indexOf(element['name'])> -1) {
        console.log("FOUND Element to Ignore" + element['name'])
        return;
      }
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


// Helper function for adding normal layers
function populateLayerSwitches(endpoint, layerGroup, highlightMonitored, element_type, map_obj, priority=0) {
  $.getJSON( endpoint, function(elements, error) {
    elements.forEach(function(element) {
      // We want to ignore a few elements
      if (ignoreList.indexOf(element['name'])> -1) {
        console.log("FOUND Element to Ignore" + element['name'])
        return;
      }
      monitored = false;
      icon = switchIconOpen;
      // We want to highlight a few elements
      if (highlightMonitored) {
        if (monitoredList.indexOf(element['name'])> -1) {
          console.log("FOUND Element to Monitor" + element['name'])
          monitored = true;
          if (element['status'] == "OPEN") {
            icon = switchIconMonitoredOpen;
          } else {
            icon = switchIconMonitoredClosed;
          }
        } else {
          icon = switchIconUnmonitored;
        }
      } else {
        if (element['status'] == "OPEN") {
          icon = switchIconOpen;
        } else {
          icon = switchIconClosed;
        }
      }

      if (('latitude' in element) && ('longitude' in element)) {
        latlong = [parseFloat(element['latitude']), parseFloat(element['longitude'])];
        marker = L.marker(latlong, {
          icon: icon,
          alt:JSON.stringify({"type":element_type,"name":element['name']})
        }).bindPopup(element['name'] + " loading..."); //.bindTooltip(element['name']);
        if (priority == 1) {
          marker.setZIndexOffset(700);
        }
        if (priority > 1 || monitored) {
          marker.setZIndexOffset(800);
        }
        layerGroup.addLayer(marker);
        // console.log("Adding Marker to Map " + element['name']);
        // switches.push({key: element['name'], value: marker});
        map_obj["switches"].push({key: element['name'], value: marker});
      } else {
        // console.log(element['name'] + " Does Not Have Location Coordinates!!");
      }
    });
    // map_obj["switches"] = switches;
  });
}

// Helper function for adding normal layers
function populateLayerSubstation(endpoint, layerGroup, iconPath, element_type, priority=0) {
  $.getJSON( endpoint, function(elements, error) {
    elements.forEach(function(element) {
      // We want to ignore a few elements
      if (ignoreList.indexOf(element['name'])> -1) {
        console.log("FOUND Element to Ignore" + element['name'])
        return;
      }
      if (('latitude' in element) && ('longitude' in element)) {
        latlong = [parseFloat(element['latitude']), parseFloat(element['longitude'])];
        marker = L.marker(latlong, {
          icon: new MegaGridIcon({iconUrl: '/static/images/icons/substation-'+element['color']+'.png'}),
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


var region_colors = ['red', 'blue', 'yellow','black', 'white', 'green', 'orange', 'green', 'orange'];
var region_colors2 = region_colors;
// var region_colors2 =['red', 'blue', 'blue','yellow', 'red', 'green', 'green', 'green', 'orange'];


function populateRegions(endpoint, layerGroup, regions_list) {
  console.log("populateRegions");
  $.getJSON( endpoint, function(elements, error) {
    elements.forEach(function(element) {
      region = L.polygon(element.points, {color: "#777"});
      regions_list.push(region);
      layerGroup.addLayer(region);
    });
  });
}


function setRegionColors(config, time) {
  console.log("Setting region colors for config " + config + " and time " + time);

  if (switchConfigs[0] == {}) {
    console.log("NOT READY TO CHANGE STATE");
  }
  // console.log((switchConfigs[time])[config]);
  switchSet = (switchConfigs[0])[config];
  // console.log((maps[1])['switches']);
  (maps[0])['switches'].forEach(function(element) {
    // console.log(element);
    swName = element['key']
    if (switchSet[swName] == "0") {
      // console.log("Found Match" + swName);
      element['value'].setIcon(switchIconMonitoredClosed);
    }
    if (switchSet[swName] == "1") {
      // console.log("Found Match" + swName);
      element['value'].setIcon(switchIconMonitoredOpen);
    }

  });

}

// Connectivity graph
/*

Sub0 ---> sw15001to149 ---> region0

region0 ---> sw15001to149 ---> Sub0
region0 ---> sw13to152 ---> region1
region0 ---> sw13to152 ---> region2


region1 ---> sw13to152 ---> region0
region1 ---> sw13to152 ---> region2
region1 ---> sw18to135 ---> region2
region1 ---> sw18to135 ---> region3

region2 ---> sw13to152 ---> region0
region2 ---> sw13to152 ---> region1
region2 ---> sw18to135 ---> region1
region2 ---> sw18to135 ---> region3
region2 ---> sw54to94 ---> region2
region2 ---> sw54to94 ---> region4
region2 ---> sw151to300 ---> region5

region3 ---> sw18to135 ---> region1
region3 ---> sw18to135 ---> region2
region3 ---> sw250to251 ---> Sub1

Sub1 ---> sw250to251 ---> region3

region4 ---> sw54to94 ---> region2
region4 ---> sw60to160 ---> region6

region5 ---> sw151to300 ---> region2
region5 ---> sw97to197 ---> region6

region6 ---> sw60to160 ---> region4
region6 ---> sw97to197 ---> region5
region6 ---> sw450to451 ---> Sub2
region6 ---> sw95to195 ---> Sub3

Sub2 ---> sw450to451 ---> region6

Sub3 ---> sw95to195 ---> region6
*/

var SW1  = 'sw15001to149';
var SW2  = 'sw250to251';
var SW3  = 'sw300to350';
var SW4  = 'sw450to451';
var SW5  = 'sw95to195';
var SW6  = 'sw13to152';
var SW7  = 'sw18to135';
var SW8  = 'sw60to160';
var SW9  = 'sw61to6101';
var SW10 = 'sw97to197';
var SW11 = 'sw54to94';
var SW12 = 'sw151to300';

function getConnectedRegions(map_obj) {
  blueSet = new Set();
  greenSet = new Set();
  redSet = new Set();
  yellowSet = new Set();
  stateList = (map_obj['switchStateList']);
  closedList = {};
  for (key in stateList) {
    // console.log(key + ": " + stateList[key]);
    if (stateList[key] == "CLOSED") {
      // console.log(key + ": " + stateList[key] + " CLOSED");
      closedList["" + key] = true;
    } else {
      closedList["" + key] = false;
    }
  }

  // console.log(stateList);
  // console.log(closedList);
  // Blue Traversal
  if (closedList[SW1]) {
    console.log("BLUE is Connected");
    blueSet.add(1);
    if(closedList[SW2]) {
      console.log("ERROR. Path from Blue to Green");
    }
    if (closedList[SW6]) {
      blueSet.add(4);
      if (closedList[SW8] || closedList[SW11]) {
        blueSet.add(5);
        if (closedList[SW5] || closedList[SW4]) {
          console.log("ERROR. Path from Blue to Red or YELLOW");
        }
        if (closedList[SW10]) {
          blueSet.add(3);
          if (closedList[SW12]) {
            blueSet.add(2);
          }
        }
      }
    }
    if (closedList[SW7]) {
      blueSet.add(2);
      if (closedList[SW12]) {
        blueSet.add(3);
        if (closedList[SW10]) {
          blueSet.add(5);
          if (closedList[SW5] || closedList[SW4]) {
            console.log("ERROR. Path from Blue to RED or YELLOW");
          }
          if (closedList[SW8] || closedList[SW11]) {
            blueSet.add(4);
          }
        }
      }
    }
  }

  // Green Traversal
  if (closedList[SW2]) {
    console.log("GREEN is Connected");
    greenSet.add(1);
    if(closedList[SW1]) {
      console.log("ERROR. Path from Blue to Green");
    }
    if (closedList[SW6]) {
      greenSet.add(4);
      if (closedList[SW8] || closedList[SW11]) {
        greenSet.add(5);
        if (closedList[SW5] || closedList[SW4]) {
          console.log("ERROR. Path from Blue to Red or YELLOW");
        }
        if (closedList[SW10]) {
          greenSet.add(3);
          if (closedList[SW12]) {
            greenSet.add(2);
          }
        }
      }
    }
    if (closedList[SW7]) {
      greenSet.add(2);
      if (closedList[SW12]) {
        greenSet.add(3);
        if (closedList[SW10]) {
          greenSet.add(5);
          if (closedList[SW5] || closedList[SW4]) {
            console.log("ERROR. Path from Blue to RED or YELLOW");
          }
          if (closedList[SW8] || closedList[SW11]) {
            greenSet.add(4);
          }
        }
      }
    }
  }

  // Red Traversal
  if(closedList[SW4]) {
    console.log("RED is Connected");
    redSet.add(5);
    if(closedList[SW5]) {
      console.log("ERROR. Path from Red to Yellow");
    }
    if(closedList[SW10]) {
      redSet.add(3);
      if(closedList[SW12]) {
        redSet.add(2);
        if(closedList[SW7]) {
          redSet.add(1);
          if(closedList[SW1] || closedList[SW2]) {
            console.log("ERROR. Path from Red to BLUE or GREEN");
          }
          if(closedList[SW6]) {
            redSet.add(4);
          }
        }

      }
    }
    if(closedList[SW8] || closedList[SW11]) {
      redSet.add(4);
      if(closedList[SW6]) {
        redSet.add(1);
        if(closedList[SW1] || closedList[SW2]) {
          console.log("ERROR. Path from Red to GREEN or BLUE");
        }
        if(closedList[SW7]) {
          redSet.add(2);
          if(closedList[SW12]) {
            redSet.add(3);
          }
        }
      }
    }
  }

  // Yellow Traversal
  if(closedList[SW5]) {
    console.log("YELLOW is Connected");
    yellowSet.add(5);
    if(closedList[SW4]) {
      console.log("ERROR. Path from Yellow to Red");
    }
    if(closedList[SW10]) {
      yellowSet.add(3);
      if(closedList[SW12]) {
        yellowSet.add(2);
        if(closedList[SW7]) {
          yellowSet.add(1);
          if(closedList[SW1] || closedList[SW2]) {
            console.log("ERROR. Path from Red to BLUE or GREEN");
          }
          if(closedList[SW6]) {
            yellowSet.add(4);
          }
        }

      }
    }
    if(closedList[SW8] || closedList[SW11]) {
      yellowSet.add(4);
      if(closedList[SW6]) {
        yellowSet.add(1);
        if(closedList[SW1] || closedList[SW2]) {
          console.log("ERROR. Path from Red to GREEN or BLUE");
        }
        if(closedList[SW7]) {
          yellowSet.add(2);
          if(closedList[SW12]) {
            yellowSet.add(3);
          }
        }
      }
    }
  }

  console.log("FINISHED Traversal. ");

  for (value of blueSet) {
    if(greenSet.has(value)){
      console.log("ERROR, OVERLAPPING GREEN AND BLUE " + value);
    }
    if(redSet.has(value)){
      console.log("ERROR, OVERLAPPING RED AND BLUE " + value);
    }
    if(yellowSet.has(value)){
      console.log("ERROR, OVERLAPPING YELLOW AND BLUE " + value);
    }
    // if(value == 4) blueSet.add(0);
    // if(value == 5) blueSet.add(6);
    // console.log("BlueSet Item: " + value);
  }
  for (value of greenSet) {
    if(blueSet.has(value)){
      console.log("ERROR, OVERLAPPING BLUE AND GREE " + value);
    }
    if(redSet.has(value)){
      console.log("ERROR, OVERLAPPING RED AND GREEN " + value);
    }
    if(yellowSet.has(value)){
      console.log("ERROR, OVERLAPPING YELLOW AND GREEN " + value);
    }
    // if(value == 4) greenSet.add(0);
    // if(value == 5) greenSet.add(6);
    // console.log("greenSet Item: " + value);
  }
  for (value of redSet) {
    if(blueSet.has(value)){
      console.log("ERROR, OVERLAPPING BLUE AND RED " + value);
    }
    if(greenSet.has(value)){
      console.log("ERROR, OVERLAPPING GREEN AND RED " + value);
    }
    if(yellowSet.has(value)){
      console.log("ERROR, OVERLAPPING YELLOW AND RED " + value);
    }
    // if(value == 4) redSet.add(0);
    // if(value == 5) redSet.add(6);
    // console.log("redSet Item: " + value);
  }

  for (value of yellowSet) {
    if(blueSet.has(value)){
      console.log("ERROR, OVERLAPPING BLUE AND YELLOW " + value);
    }
    if(greenSet.has(value)){
      console.log("ERROR, OVERLAPPING GREEN AND YELLOW " + value);
    }
    if(redSet.has(value)){
      console.log("ERROR, OVERLAPPING RED AND YELLOW " + value);
    }
    // if(value == 4) yellowSet.add(0);
    // if(value == 5) yellowSet.add(6);
    // console.log("yellowSet Item: " + value);
  }


  regionsList = ((map_obj['regions']));
  for(region = 0; region < regionsList.length; region += 1) {
    regionsList[region].setStyle({color: "white"}).redraw();
  }

  redSet.forEach(function(region) {
    regionsList[region].setStyle({color: "red"}).redraw();
  })


  greenSet.forEach(function(region) {
    regionsList[region].setStyle({color: "green"}).redraw();
  })

  blueSet.forEach(function(region) {
    regionsList[region].setStyle({color: "blue"}).redraw();
  })

  yellowSet.forEach(function(region) {
    regionsList[region].setStyle({color: "yellow"}).redraw();
  })

}



function setSwitchStates(config, time) {
  console.log("Setting switch states for config " + config + " and time " + time);

  if (switchConfigs[0] == {}) {
    console.log("NOT READY TO CHANGE STATE");
  }
  // console.log((switchConfigs[time])[config]);
  switchSet = (switchConfigs[0])[config];
  // console.log((maps[1])['switches']);
  (maps[0])['switches'].forEach(function(element) {
    // console.log(element);
    swName = element['key']
    if (switchSet[swName] == "1") {
      // console.log("Found Match" + swName);
      element['value'].setIcon(switchIconMonitoredClosed);
      (maps[0]['switchStateList'])[swName] = "CLOSED";
      // (map_obj['switchStateList'])[swName] = "CLOSED";
    }
    if (switchSet[swName] == "0") {
      // console.log("Found Match" + swName);
      element['value'].setIcon(switchIconMonitoredOpen);
      (maps[0]['switchStateList'])[swName] = "OPEN";
      // (map_obj['switchStateList'])[swName] = "OPEN";
    }

  });

  switchSet = (switchConfigs[time])[config];
  (maps[1])['switches'].forEach(function(element) {
    if (monitoredList.indexOf(element['key'])> -1) {
      // console.log(element);
      swName = element['key']
      if (switchSet[swName] == "1") {
        // console.log("Found Match" + swName);
        element['value'].setIcon(switchIconMonitoredClosed);
        (maps[1]['switchStateList'])[swName] = "CLOSED";
      }
      if (switchSet[swName] == "0") {
        // console.log("Found Match" + swName);
        element['value'].setIcon(switchIconMonitoredOpen);
        (maps[1]['switchStateList'])[swName] = "OPEN";
      }
    } else {
      // console.log(element);
      swName = element['key']
      if (switchSet[swName] == "1") {
        // console.log("Found Match" + swName);
        element['value'].setIcon(switchIconUnmonitoredClosed);
        (maps[1]['switchStateList'])[swName] = "CLOSED";
      }
      if (switchSet[swName] == "0") {
        // console.log("Found Match" + swName);
        element['value'].setIcon(switchIconUnmonitoredOpen);
        (maps[1]['switchStateList'])[swName] = "OPEN";
      }
    }

  });

  //   Time to shade the regions!
  getConnectedRegions(maps[0]);
  getConnectedRegions(maps[1]);
}

function getSwitchByName(map_obj, switchName) {
  map_obj['switches'].forEach(function(element) {
    console.log(element);
  })
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
                // We want to ignore a few elements
                if (ignoreList.indexOf(feature.properties.name)> -1) {
                  console.log("FOUND Element to Ignore" + feature.properties.name)
                  return;
                }
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
                // We want to ignore a few elements
                if (ignoreList.indexOf(feature.properties.name)> -1) {
                  console.log("FOUND Element to Ignore" + feature.properties.name)
                  return;
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
    });
  });

  setTimeout(function(){ map_obj.jsonPromise.abort(); }, 2000);

  // Add each of the desired layers
  // populateLayerSwitches(switchApiEndpoint, (map_obj.overlay["Switches"]), switchIcon, switchIcon, "switch", priority=2);
  // populateLayer(switchApiEndpoint, (map_obj.overlay["Switches"]), switchIcon, "switch", priority=2);
  populateLayer(meterApiEndpoint, (map_obj.overlay["Meters"]), meterIcon, "meter", priority=1);
  populateLayer(nodeApiEndpoint, (map_obj.overlay["Nodes"]), nodeIcon, "node");
  populateLayer(loadApiEndpoint, (map_obj.overlay["Loads"]), loadIcon, "load");

  populateLayerSubstation(substationApiEndpoint, (map_obj.overlay["Substations"]), substationIcon, "substation");

  populateRegions(regionApiEndpoint, (map_obj.overlay["Regions"]), map_obj["regions"]);

  console.log("Overlay meters done")


  // Houses do not have location information, so skip them
  // populateLayer(houseApiEndpoint, houseLayer, houseIcon, "house");

});

populateLayerSwitches(switchApiEndpoint, (maps[0].overlay["Switches"]), highlightMonitored=false, "switch", maps[0], priority=2);
populateLayerSwitches(switchApiEndpoint, (maps[1].overlay["Switches"]), highlightMonitored=true, "switch", maps[1], priority=1);



maps.forEach(function(map_obj){
  layerControl = L.control.layers(map_obj.base, map_obj.overlay).addTo(map_obj.map);
  // layerControl.addTo(map_obj.map);

  // Can't figure out how to do the map click popups, but they are annoying anyway
  map_obj.map.on('click', function(e, map_obj) {
    onMapClick(e, map_obj);
  });
  // map_obj.map.on('popupopen', function(e) {
  //   pop_up(e);
  // });
  // Sync to Other Maps
  maps.forEach(function(syncMapTo){
    map_obj.map.sync(syncMapTo.map);
  });
});

function getSwitchStatesFromUrl(index, configFileUrl) {
  switchStates = [];
  $.ajax({
          type: "GET",
          url: configFileUrl,
          dataType: "text",
          success: function(data) {
            switchStates = $.csv.toObjects(data);
            switchConfigs[index] = switchStates;
            // console.log(switchStates);
          }
       });
  return switchStates;
}

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    // alert(lines);
}


$( function() {
  var handle = $( "#starting-slider-handle" );
  $( "#starting-slider" ).slider({
    min: 0,
    max: 44,
    step: 1,
    create: function() {
      handle.text( $( this ).slider( "value" ) );
      currentConfig = $( this ).slider( "value" );
    },
    slide: function( event, ui ) {
      handle.text( ui.value );
      currentConfig = ui.value;
      setSwitchStates(currentConfig, currentTime);
    }
  });
} );

$( function() {
  labels = {"0":"Real Time", "1":"+15 Minutes", "2":"+30 Minutes", "3":"+1 Hour",
            "4":"+2 Hours", "5":"+3 Hours", "6":"+5 Hours", "7":"+1 Day", "8":"+2 Days"};
  var handle2 = $( "#time-slider-handle" );
  $( "#time-slider" ).slider({
    min: 0,
    max: 8,
    step: 1,
    create: function() {
      handle2.text( labels[$( this ).slider( "value" )] );
      currentTime = $( this ).slider( "value" );
    },
    slide: function( event, ui ) {
      handle2.text( labels[ui.value] );
      currentTime = ui.value;
      setSwitchStates(currentConfig, currentTime);
    }
  });
} );

$( document ).ready(function() {
  for (index = 0; index < switchConfigsUrls.length; index +=1) {
    getSwitchStatesFromUrl(index, switchConfigFileEndpoint+switchConfigsUrls[index]);
  }
});



console.log("Done, but waiting on web requests");
