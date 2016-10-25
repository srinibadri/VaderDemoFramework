

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
    // overlayLayers1["Line Sensors"],
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
        }).bindPopup(element['name'] + switchStateList[element['name']] ); //.bindTooltip(element['name']);
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


////// Error Bars Chart
loadsTrue = [248.37,241.15,233.92,226.7,219.47,215.59,211.76,207.94,204.12,196.66,189.06,181.46,173.86,170.42,167.22,164.01,160.81,160.2,159.8,159.39,158.98,156.4,153.6,150.8,148.01,148.83,150.09,151.35,152.61,160.32,168.96,177.6,186.24,197.25,208.65,220.06,231.47,241.79,251.9,262.01,272.12,283.83,295.9,307.97,320.04,331.61,343.07,354.52,365.98,377.98,390.14,402.3,414.46,425.77,436.82,447.87,458.92,467.72,475.78,483.84,491.9,501.03,510.56,520.09,529.63,534.3,537.03,539.75,542.47,536.1,525.73,515.37,505,495.81,487.18,478.55,469.92,461.07,452.11,443.14,434.18,424.29,413.88,403.47,393.06,384.24,376.38,368.51,360.65,347.34,330.46,313.59,296.71,284.69,276.09,267.48,258.88,248.61,237.07,225.53,213.99,206.76,203.04,199.32,195.6,190.49,184.15,177.8,171.46,167.44,165.61,163.77,161.94,159.97,157.86,155.76,153.65,152.3,151.76,151.22,150.68,151.15,152.78,154.41,156.04,159.68,165.84,172,178.16,185.37,193.99,202.6,211.22,218.46,223.69,228.91,234.14,242,253.98,265.96,277.94,291.19,306.58,321.97,337.37,352.8,368.29,383.79,399.28,410.1,411.64,413.18,414.72,418.45,426.89,435.33,443.77,451.41,457.18,462.94,468.71,473.63,476.38,479.12,481.87,483.45,481.75,480.05,478.36,475.1,467.06,459.03,450.99,442.01,429.86,417.71,405.56,395.07,390.79,386.52,382.25,376.68,365.66,354.63,343.61,331.85,316.6,301.35,286.11,271.48,260.22,248.97,237.71,226.72,217.38,208.05,198.72,189.95,185.32,180.69,176.05,171.39,166.5,161.61,156.71,152.16,151.38,150.59,149.81,149,147.83,146.67,145.5,144.38,144.11,143.83,143.56,143.31,143.72,144.13,144.54,145.01,150.44,155.87,161.29,166.72,171.05,175.36,179.68,183.99,194.93,206.02,217.12,228.21,242.56,257.04,271.53,286.02,299.6,313.13,326.66,340.19,350.04,359.59,369.13,378.67,392.04,405.8,419.57,433.34,448.19,463.19,478.18,493.17,499.85,505.26,510.67,516.09,520.3,524.3,528.3,532.3,534.89,537.19,539.5,541.8,531.97,519.37,506.77,494.18,486.75,480.65,474.56,468.46,458.23,446.82,435.41,424.01,410.12,395.44,380.76,366.09,346.79,325.9,305.01,284.11,271.73,262.59,253.45,244.31,236.48,229.2,221.92,214.65,208.02,201.68,195.35,189.01,184.4,180.64,176.88,173.11,168.52,163.48,158.44,153.4,151.17,150.56,149.94,149.33,150.32,152.3,154.29,156.27,155.95,154.08,152.21,150.34,152.86,158.54,164.23,169.92,175.42,180.77,186.13,191.48,199.97,211.07,222.17,233.27,245.28,258.12,270.96,283.8,296.19,308.16,320.13,332.1,346.59,363.69,380.79,397.89,413.42,427.22,441.01,454.81,466.31,475.06,483.81,492.56,503.2,516.27,529.35,542.42,551.47,554.92,558.38,561.83,563.88,563.82,563.76,563.7,558.81,546.16,533.5,520.85,509.95,502.1,494.24,486.39,476.94,464.49,452.04,439.59,425.58,408.38,391.17,373.97,356.9,340.11,323.32,306.54,290.76,277.44,264.11,250.78,238.7,229.89,221.08,212.27,204.77,201.03,197.28,193.54,189.8,186.1,182.4,178.69,174.81,170.32,165.83,161.34,157.56,156.6,155.63,154.66,154.14,155.58,157.03,158.47,159.53,158.7,157.87,157.04,156.81,159.99,163.16,166.33,169.82,175.35,180.88,186.41,192.13,199.31,206.49,213.68,221.57,236.1,250.63,265.16,279.69,294.27,308.84,323.42,338.14,355.12,372.11,389.09,406.04,422.06,438.08,454.1,469.98,479.87,489.76,499.65,509.54,519.69,529.83,539.98,550.13,554.06,557.92,561.78,565.63,561.95,558.04,554.12,550.21,538.48,526.35,514.23,502.1,489.26,476.36,463.47,450.57,439.21,427.98,416.76,405.53,396.67,388.07,379.47,370.87,355.99,340.26,324.53,308.8,294.64,280.73,266.82,252.91,243.66,235.27,226.88,218.5,211.87,205.63,199.38,193.13,186.98,180.86,174.74,168.62,165.97,164.24,162.51,160.78,158.55,156.17,153.8,151.42,151.49,152.35,153.21,154.07,155.76,157.75,159.73,161.72,163.19,164.46,165.72,166.99,171.12,176.49,181.85,187.21,194.88,203.63,212.37,221.12,232.69,245.68,258.67,271.65,281.69,290.11,298.52,306.94,315.48,324.09,332.7,341.31,350.27,359.45,368.63,377.81,388.77,400.96,413.16,425.35,438.08,451.21,464.34,477.47,486.67,492.76,498.85,504.93,503.5,495.64,487.77,479.91,472.3,464.91,457.53,450.15,443.34,437.1,430.85,424.61,419.03,414.14,409.26,404.37,396.54,385.34,374.14,362.94,352.32,342.42,332.53,322.63,309.8,293.09,276.39,259.68,246.82,239.41,232,224.59,217.53,210.99,204.45,197.91,191.95,186.95,181.94,176.94,172.61,169.48,166.36,163.24,159.87,156.05,152.22,148.4,145.72,145.46,145.19,144.93,145.5,147.97,150.45,152.92,155.78,159.64,163.49,167.35,173.64,186.53,199.43,212.32,222.94,226.78,230.62,234.46,241.25,257.69,274.14,290.58,306.16,318.59,331.01,343.44,355.96,368.87,381.77,394.68,406.61,414.05,421.5,428.94,437.25,450.04,462.83,475.62,487.84,496.69,505.54,514.4,521.19,513.7,506.2,498.71,492.07,492.46,492.86,493.25,492.55,480.75,468.96,457.16,445.69,438.4,431.12,423.83,416.69,412.27,407.84,403.42,398.69,385.97,373.25,360.52,347.69,328.82,309.96,291.09,272.22];
loadsUpper = [248.37,241.15,233.92,226.7,219.47,215.59,211.76,207.94,204.12,196.66,189.06,181.46,173.86,170.42,167.22,164.01,160.81,160.2,159.8,159.39,158.98,156.4,153.6,150.8,148.01,148.83,150.09,151.35,152.61,160.32,168.96,177.6,186.24,197.25,208.65,220.06,231.47,241.79,251.9,262.01,272.12,283.83,295.9,307.97,320.04,331.61,343.07,354.52,365.98,377.98,390.14,402.3,414.46,425.77,436.82,447.87,458.92,467.72,475.78,483.84,491.9,501.03,510.56,520.09,529.63,534.3,537.03,539.75,542.47,536.1,525.73,515.37,505,495.81,487.18,478.55,469.92,461.07,452.11,443.14,434.18,424.29,413.88,403.47,393.06,384.24,376.38,368.51,360.65,347.34,330.46,313.59,296.71,284.69,276.09,267.48,258.88,248.61,237.07,225.53,213.99,206.76,203.04,199.32,195.6,190.49,184.15,177.8,171.46,167.44,165.61,163.77,161.94,159.97,157.86,155.76,153.65,152.3,151.76,151.22,150.68,151.15,152.78,154.41,156.04,159.68,165.84,172,178.16,185.37,193.99,202.6,211.22,218.46,223.69,228.91,234.14,242,253.98,265.96,277.94,291.19,306.58,321.97,337.37,352.8,368.29,383.79,399.28,410.1,411.64,413.18,414.72,418.45,426.89,435.33,443.77,451.41,457.18,462.94,468.71,473.63,476.38,479.12,481.87,483.45,481.75,480.05,478.36,475.1,467.06,459.03,450.99,442.01,429.86,417.71,405.56,395.07,390.79,386.52,382.25,376.68,365.66,354.63,343.61,331.85,316.6,301.35,286.11,271.48,260.22,248.97,237.71,226.72,217.38,208.05,198.72,189.95,185.32,180.69,176.05,171.39,166.5,161.61,156.71,152.16,151.38,150.59,149.81,149,147.83,146.67,145.5,144.38,144.11,143.83,143.56,143.31,143.72,144.13,144.54,145.01,150.44,155.87,161.29,166.72,171.05,175.36,179.68,183.99,194.93,206.02,217.12,228.21,242.56,257.04,271.53,286.02,299.6,313.13,326.66,340.19,350.04,359.59,369.13,378.67,392.04,405.8,419.57,433.34,448.19,463.19,478.18,493.17,499.85,505.26,510.67,516.09,520.3,524.3,528.3,532.3,534.89,537.19,539.5,541.8,531.97,519.37,506.77,494.18,486.75,480.65,474.56,468.46,458.23,446.82,435.41,424.01,410.12,395.44,380.76,366.09,346.79,325.9,305.01,284.11,271.73,262.59,253.45,244.31,236.48,229.2,221.92,214.65,208.02,201.68,195.35,189.01,184.4,180.64,176.88,173.11,168.52,163.48,158.44,153.4,151.17,150.56,149.94,149.33,150.32,152.3,154.29,156.27,155.95,154.08,152.21,150.34,152.86,158.54,164.23,169.92,175.42,180.77,186.13,191.48,199.97,211.07,222.17,233.27,245.28,258.12,270.96,283.8,296.19,308.16,320.13,332.1,346.59,363.69,380.79,397.89,413.42,427.22,441.01,454.81,466.31,475.06,483.81,492.56,503.2,516.27,529.35,542.42,551.47,554.92,558.38,561.83,563.88,563.82,563.76,563.7,558.81,546.16,533.5,520.85,509.95,502.1,494.24,486.39,476.94,464.49,452.04,439.59,425.58,408.38,391.17,373.97,356.9,340.11,323.32,306.54,290.76,277.44,264.11,250.78,238.7,229.89,221.08,212.27,204.77,201.03,197.28,193.54,189.8,186.1,182.4,178.69,174.81,170.32,165.83,161.34,157.56,156.6,155.63,154.66,154.14,155.58,157.03,158.47,159.53,158.7,157.87,157.04,156.81,159.99,163.16,166.33,169.82,175.35,180.88,186.41,192.13,199.31,206.49,213.68,221.57,236.1,250.63,265.16,279.69,294.27,308.84,323.42,338.14,355.12,372.11,389.09,406.04,422.06,438.08,454.1,469.98,479.87,489.76,499.65,509.54,519.69,529.83,539.98,550.13,554.06,557.92,561.78,565.63,561.95,558.04,554.12,550.21,538.48,526.35,514.23,502.1,489.26,476.36,463.47,450.57,439.21,427.98,416.76,405.53,396.67,388.07,379.47,370.87,355.99,340.26,324.53,308.8,294.64,286.23,292.97,285.13,281.87,274.47,266.91,259.18,253.4,250.97,248.22,245.18,241.96,236.25,230.4,224.39,222.9,222.58,222.23,221.83,220.7,217.79,214.88,211.95,212.43,214.03,215.64,217.25,220.03,223.25,226.47,229.7,232.21,234.44,236.67,238.91,245.27,253.41,261.57,269.77,281.33,294.48,307.68,320.92,338.3,357.82,377.41,397.06,412.45,425.52,438.64,451.8,465.18,478.72,492.29,505.91,520.1,534.65,549.26,563.91,581.28,600.54,619.86,639.25,659.51,680.44,701.44,722.51,737.7,748.19,758.72,769.28,768.4,757.67,746.91,736.11,725.65,715.5,705.32,695.1,685.73,677.2,668.64,660.05,652.45,645.91,639.35,632.76,621.52,604.96,588.34,571.66,555.85,541.12,526.34,511.5,491.96,466.03,440.03,413.97,393.96,382.63,371.26,359.87,348.99,338.93,328.85,318.73,309.53,301.84,294.13,286.39,279.74,275.02,270.3,265.55,260.41,254.5,248.57,242.62,238.55,238.41,238.28,238.14,239.38,243.74,248.12,252.51,257.56,264.26,270.98,277.71,288.5,310.3,332.16,354.07,372.24,379.11,386,392.91,404.77,432.89,461.07,489.33,516.18,537.79,559.44,581.14,603.06,625.68,648.35,671.07,692.18,705.7,719.25,732.83,747.92,770.71,793.56,816.46,838.44,854.66,870.93,887.23,900.01,888.12,876.2,864.24,853.73,855.42,857.12,858.81,858.6,839.02,819.39,799.71,780.56,768.69,756.79,744.86,733.17,726.23,719.26,712.28,704.76,683.05,661.3,639.49,617.44,584.61,551.7,518.71,485.64];
loadsLower = [248.37,241.15,233.92,226.7,219.47,215.59,211.76,207.94,204.12,196.66,189.06,181.46,173.86,170.42,167.22,164.01,160.81,160.2,159.8,159.39,158.98,156.4,153.6,150.8,148.01,148.83,150.09,151.35,152.61,160.32,168.96,177.6,186.24,197.25,208.65,220.06,231.47,241.79,251.9,262.01,272.12,283.83,295.9,307.97,320.04,331.61,343.07,354.52,365.98,377.98,390.14,402.3,414.46,425.77,436.82,447.87,458.92,467.72,475.78,483.84,491.9,501.03,510.56,520.09,529.63,534.3,537.03,539.75,542.47,536.1,525.73,515.37,505,495.81,487.18,478.55,469.92,461.07,452.11,443.14,434.18,424.29,413.88,403.47,393.06,384.24,376.38,368.51,360.65,347.34,330.46,313.59,296.71,284.69,276.09,267.48,258.88,248.61,237.07,225.53,213.99,206.76,203.04,199.32,195.6,190.49,184.15,177.8,171.46,167.44,165.61,163.77,161.94,159.97,157.86,155.76,153.65,152.3,151.76,151.22,150.68,151.15,152.78,154.41,156.04,159.68,165.84,172,178.16,185.37,193.99,202.6,211.22,218.46,223.69,228.91,234.14,242,253.98,265.96,277.94,291.19,306.58,321.97,337.37,352.8,368.29,383.79,399.28,410.1,411.64,413.18,414.72,418.45,426.89,435.33,443.77,451.41,457.18,462.94,468.71,473.63,476.38,479.12,481.87,483.45,481.75,480.05,478.36,475.1,467.06,459.03,450.99,442.01,429.86,417.71,405.56,395.07,390.79,386.52,382.25,376.68,365.66,354.63,343.61,331.85,316.6,301.35,286.11,271.48,260.22,248.97,237.71,226.72,217.38,208.05,198.72,189.95,185.32,180.69,176.05,171.39,166.5,161.61,156.71,152.16,151.38,150.59,149.81,149,147.83,146.67,145.5,144.38,144.11,143.83,143.56,143.31,143.72,144.13,144.54,145.01,150.44,155.87,161.29,166.72,171.05,175.36,179.68,183.99,194.93,206.02,217.12,228.21,242.56,257.04,271.53,286.02,299.6,313.13,326.66,340.19,350.04,359.59,369.13,378.67,392.04,405.8,419.57,433.34,448.19,463.19,478.18,493.17,499.85,505.26,510.67,516.09,520.3,524.3,528.3,532.3,534.89,537.19,539.5,541.8,531.97,519.37,506.77,494.18,486.75,480.65,474.56,468.46,458.23,446.82,435.41,424.01,410.12,395.44,380.76,366.09,346.79,325.9,305.01,284.11,271.73,262.59,253.45,244.31,236.48,229.2,221.92,214.65,208.02,201.68,195.35,189.01,184.4,180.64,176.88,173.11,168.52,163.48,158.44,153.4,151.17,150.56,149.94,149.33,150.32,152.3,154.29,156.27,155.95,154.08,152.21,150.34,152.86,158.54,164.23,169.92,175.42,180.77,186.13,191.48,199.97,211.07,222.17,233.27,245.28,258.12,270.96,283.8,296.19,308.16,320.13,332.1,346.59,363.69,380.79,397.89,413.42,427.22,441.01,454.81,466.31,475.06,483.81,492.56,503.2,516.27,529.35,542.42,551.47,554.92,558.38,561.83,563.88,563.82,563.76,563.7,558.81,546.16,533.5,520.85,509.95,502.1,494.24,486.39,476.94,464.49,452.04,439.59,425.58,408.38,391.17,373.97,356.9,340.11,323.32,306.54,290.76,277.44,264.11,250.78,238.7,229.89,221.08,212.27,204.77,201.03,197.28,193.54,189.8,186.1,182.4,178.69,174.81,170.32,165.83,161.34,157.56,156.6,155.63,154.66,154.14,155.58,157.03,158.47,159.53,158.7,157.87,157.04,156.81,159.99,163.16,166.33,169.82,175.35,180.88,186.41,192.13,199.31,206.49,213.68,221.57,236.1,250.63,265.16,279.69,294.27,308.84,323.42,338.14,355.12,372.11,389.09,406.04,422.06,438.08,454.1,469.98,479.87,489.76,499.65,509.54,519.69,529.83,539.98,550.13,554.06,557.92,561.78,565.63,561.95,558.04,554.12,550.21,538.48,526.35,514.23,502.1,489.26,476.36,463.47,450.57,439.21,427.98,416.76,405.53,396.67,388.07,379.47,370.87,355.99,340.26,324.53,308.8,294.63,275.22,240.67,220.69,205.45,196.08,186.86,177.81,170.35,160.29,150.53,141.08,132.01,125.47,119.09,112.85,109.04,105.89,102.79,99.721,96.397,94.55,92.715,90.892,90.542,90.663,90.781,90.894,91.489,92.249,92.999,93.738,94.169,94.475,94.775,95.069,96.982,99.566,102.12,104.65,108.44,112.78,117.07,121.33,127.07,133.53,139.92,146.25,150.92,154.69,158.41,162.08,165.78,169.47,173.11,176.71,180.44,184.25,188,191.71,196.27,201.39,206.45,211.44,216.64,221.97,227.23,232.43,235.65,237.33,238.97,240.59,238.61,233.6,228.64,223.71,218.95,214.33,209.74,205.2,200.95,196.99,193.07,189.18,185.61,182.38,179.17,175.99,171.56,165.72,159.93,154.21,148.79,143.73,138.72,133.76,127.64,120.16,112.74,105.4,99.674,96.193,92.743,89.323,86.069,83.051,80.06,77.096,74.382,72.061,69.76,67.479,65.476,63.945,62.427,60.922,59.34,57.601,55.878,54.17,52.897,52.504,52.113,51.723,51.63,52.204,52.769,53.323,54.005,55.015,56.01,56.989,58.776,62.76,66.692,70.571,73.645,74.45,75.24,76.014,77.721,82.493,87.198,91.836,96.134,99.386,102.59,105.74,108.86,112.06,115.2,118.29,121.03,122.4,123.74,125.05,126.58,129.37,132.1,134.78,137.25,138.72,140.16,141.57,142.37,139.28,136.21,133.18,130.4,129.5,128.59,127.69,126.5,122.49,118.53,114.61,110.83,108.12,105.44,102.8,100.21,98.308,96.421,94.551,92.63,88.886,85.194,81.554,77.941,73.04,68.216,63.469,58.8];

loadsTrue1 = new Array(loadsTrue.length);
for(index = 0; index<loadsTrue.length; index+=1) {
  loadsTrue1[index] = [index,loadsTrue[index]];
}
loadsLower1 = new Array(loadsLower.length);
for(index = 0; index<loadsLower.length; index+=1) {
  loadsLower1[index] = [index,loadsLower[index]];
}
loadsUpper1 = new Array(loadsUpper.length);
for(index = 0; index<loadsUpper.length; index+=1) {
  loadsUpper1[index] = [index,loadsUpper[index]];
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

  // Configure Popups
  mapSwitches = ((maps[0]['switches']));
  for(index = 0; index < mapSwitches.length; index+= 1) {
    (mapSwitches[index].value).bindPopup(mapSwitches[index].key + " " + (maps[0]['switchStateList'])[mapSwitches[index].key]);
  }
  mapSwitches = ((maps[1]['switches']));
  for(index = 0; index < mapSwitches.length; index+= 1) {
    (mapSwitches[index].value).bindPopup(mapSwitches[index].key + " " + (maps[1]['switchStateList'])[mapSwitches[index].key]);
  }


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
  // map_obj.jsonPromise = $.getJSON( sensorApiEndpoint, function(sensorData) {
  //   if (!sensorData) { return; }
  //   if (sensorData['status'] == "False") { return; }
  //   sensor_list = sensorData;
  //   sensor_layers = [];
  //   sensor_layers_names = [];
  //   // console.log(sensor_list);
  //
  //   // Then get the list of lines
  //   $.getJSON( lineApiEndpoint, function(geo_json_data) {
  //     map_obj.overlay["Lines"].addLayer(L.geoJSON(geo_json_data,
  //         {filter: function(feature, layer) {return feature.geometry.type == "LineString";},
  //             onEachFeature: function(feature, layer) {
  //               // We want to ignore a few elements
  //               if (ignoreList.indexOf(feature.properties.name)> -1) {
  //                 console.log("FOUND Element to Ignore" + feature.properties.name)
  //                 return;
  //               }
  //                 sensorName = (feature.properties.name).replace("line","sensor");
  //                 // console.log(sensorName);
  //                 if (sensor_list.indexOf(sensorName) > -1) {
  //                   // console.log(sensorName);
  //                   // layer.setStyle(myStyle);
  //                   sensor_layers.push(layer.toGeoJSON());
  //                   sensor_layers_names.push(sensorName);
  //                 }
  //                   layer.bindPopup(feature.properties.name);
  //                   // layer.bindTooltip(feature.properties.name);
  //             },
  //             // This style is just used as a sneaky/dumb way of
  //             //    communicating to the popup handler.
  //             style: function(feature) {
  //               return {className:(feature.properties.name)};
  //             }
  //       })
  //     )
  //     for (i = 0; i < sensor_layers.length; ++i) {
  //       map_obj.overlay["Line Sensors"].addLayer(L.geoJson(sensor_layers[i], {style: function(feature) {
  //         return {color: "#ff7800", className:(sensor_layers_names[i])}
  //       }}).bindPopup(sensor_layers_names[i]));
  //
  //     }
  //
  //   });
  // }).error(function() {
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
  // });

  // setTimeout(function(){ map_obj.jsonPromise.abort(); }, 1500);

  // Add each of the desired layers
  // populateLayerSwitches(switchApiEndpoint, (map_obj.overlay["Switches"]), switchIcon, switchIcon, "switch", priority=2);
  // populateLayer(switchApiEndpoint, (map_obj.overlay["Switches"]), switchIcon, "switch", priority=2);
  populateLayer(meterApiEndpoint, (map_obj.overlay["Meters"]), meterIcon, "meter", priority=1);
  populateLayer(nodeApiEndpoint, (map_obj.overlay["Nodes"]), nodeIcon, "node");
  populateLayer(loadApiEndpoint, (map_obj.overlay["Loads"]), loadIcon, "load");

  populateLayerSubstation(substationApiEndpoint, (map_obj.overlay["Substations"]), substationIcon, "substation");

  populateRegions(regionApiEndpoint, (map_obj.overlay["Regions"]), map_obj["regions"]);

  console.log("Overlay meters done")

  setTimeout(function() { setSwitchStates(currentConfig, currentTime); }, 1500);

  // Houses do not have location information, so skip them
  // populateLayer(houseApiEndpoint, houseLayer, houseIcon, "house");

});

populateLayerSwitches(switchApiEndpoint, (maps[0].overlay["Switches"]), highlightMonitored=false, "switch", maps[0], priority=2);
populateLayerSwitches(switchApiEndpoint, (maps[1].overlay["Switches"]), highlightMonitored=true, "switch", maps[1], priority=1);



maps.forEach(function(map_obj){
  layerControl = L.control.layers(map_obj.base, map_obj.overlay).addTo(map_obj.map);
  // layerControl.addTo(map_obj.map);

  // Can't figure out how to do the map click popups, but they are annoying anyway
  // map_obj.map.on('click', function(e, map_obj) {
  //   onMapClick(e, map_obj);
  // });
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

$( function() {
  $.plot("#graph1", [loadsTrue1, loadsUpper1, loadsLower1],
  {xaxis:{show: false},yaxis:{show: false}});
});



console.log("Done, but waiting on web requests");
