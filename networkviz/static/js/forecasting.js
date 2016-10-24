

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
    feederApiEndpoint = "/static/data/cache/feeder.json";

var sensorApiEndpoint = "/vader/api/sensor/",
    regionApiEndpoint = "/vader/api/region/";
var sensor_list = [];



var region_colors = ['red', 'blue', 'grey','yellow', 'red', 'black', 'green', 'green', 'orange'];


var regions = [{
    "type": "Feature",
    "properties": {"region": "1"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-118.99704,35.39185],
            [-119.00208,35.39185],
            [-119.00208,35.38780],
            [-118.99914,35.38780],
            [-118.99914,35.39089],
            [-118.99704,35.39092],
            [-118.99704,35.39185],

        ]]
    }
}, {
    "type": "Feature",
    "properties": {"region": "2"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
        [-119.00011,35.38383],
        [-119.00011,35.38741],
        [-119.00363,35.38741],
        [-119.00363,35.38383],
        [-119.00011,35.38383],
        ]]
    }
}];


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


// Theme Layers
var baseLayers1 = {
    "Mapbox Theme": Mapbox_Theme
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



var map1 = L.map('map1', {
    layers: [baseLayers1["Mapbox Theme"],
    // overlayLayers1["Meters"],
    overlayLayers1["Switches"],
    // overlayLayers1["Nodes"],
    overlayLayers1["Loads"],
    // overlayLayers1["Line Sensors"],
    overlayLayers1["Lines"],
    overlayLayers1["Regions"]],
    center: center,
    zoom: zoom,
    scrollWheelZoom: false
});

map1.attributionControl.setPrefix('');
// var map2 = L.map('map2', {
//     layers: [layer2],
//     center: center,
//     zoom: zoom,
//     zoomControl: false
// });

// Add each map to the map array. This will be useful for scalable calling later
maps.push({"map":map1, "base":baseLayers1, "overlay":overlayLayers1, "popup":L.popup()});
// maps.push({"map":map2, "base":baseLayers2, "overlay":overlayLayers2, "popup":L.popup()});
// maps.push(map3);


console.log("Maps Finished");


//##################### Handlers #####################





//##################### Controls #####################

//---- Layers Related

L.Control.Watermark = L.Control.extend({
    onAdd: function(map) {
      console.log("Testing");
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
        });//.bindPopup(element['name'] + " loading..."); //.bindTooltip(element['name']);
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


// Adds each of the layers to each of the maps
maps.forEach(function(map_obj){
  // Just so we have an offline demo as well
  // Then get the list of lines
  $.getJSON( lineApiEndpoint, function(geo_json_data) {
    map_obj.overlay["Lines"].addLayer(L.geoJSON(geo_json_data,
        {filter: function(feature, layer) {return feature.geometry.type == "LineString";},
            onEachFeature: function(feature, layer) {
                  // layer.bindPopup(feature.properties.name);
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

  // Add each of the desired layers
  console.log("Overlay meters")
  console.log(map_obj.overlay["Meters"])
  populateLayer(switchApiEndpoint, (map_obj.overlay["Switches"]), switchIcon, "switch", priority=2);
  populateLayer(meterApiEndpoint, (map_obj.overlay["Meters"]), meterIcon, "meter", priority=1);
  populateLayer(nodeApiEndpoint, (map_obj.overlay["Nodes"]), nodeIcon, "node");
  populateLayer(loadApiEndpoint, (map_obj.overlay["Loads"]), loadIcon, "load");

  populateRegions(regions, (map_obj.overlay["Regions"]));
  // populateRegions(regionApiEndpoint, (map_obj.overlay["Regions"]), map_obj.predict_state);

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
  // map_obj.map.on('popupopen', function(e) {
  //   pop_up(e);
  // });
  // Sync to Other Maps
  // maps.forEach(function(syncMapTo){
  //   map_obj.map.sync(syncMapTo.map);
  // });
});


console.log("Done, but waiting on web requests");


// ##################### Forecasting Business Logic
var currentDate = "11-01-2011";
var currentTime = "10:00";
var currentMeter = 0;
var currentAlgo = "SVR";
var currentPredictRange = 1;
var meterToZip = [
  93309,93309,93309,93309,93309,93309,93309,93309,93309,93309,93309,93309,93309,
  93309,93309,93309,93309,93309,93309,93309,93309,93309,93309,93309,93309,93309,
  93309,93309,93309,93309,93309,93309,93307,93307,93307,93307,93307,93307,94585,
  93307,93307,93307,93307,93307,93635,93307,94061,94061,94061,94061,94061,94061,
  94061,94061,94061,94061,94061,94061,94061,94061,94061,94061,94061,94061,93313,
  93313,93313,93313,93313,93313,93313,93306,94806,93307,93307,93307,93307,93307,
  93307,93307,93307,93307,93307,93307,93307,93307,93307,93307,93307,93307,93307,
  93307,93307,93307,93307,93307,93307,93307,93307,93307];
var hoursInDay = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
var temperature;
var trueValues = {};
var trueValuesInvert  = new Array(100);
for(index = 0; index < trueValuesInvert.length; index +=1) {
  trueValuesInvert[index] = new Array(720);
}
var tempByZipUrl = "/static/data/temp_by_zip.csv";
var loadTrueUrl = "/static/data/load_true.csv";
var algorithmTypes = [
  "AdaBoostDTR", "AdaptiveLinear", "DecisionTreeRegressor",
    "GradientBoostingRegressor", "KNeighborsRegressor", "LassoLarsIC",
    "OLS", "SVR"];
var algorithmBaseUrl = "/static/data/forecast_demo/";

// Note, this has NOT been CSV parsed
var predictionData = {};
var predictionDataInvert = {};

var graphsEnabled = false;

function updateGraphs() {
  showGraphs(meter=currentMeter,
    date_time=(currentDate+" "+currentTime),
    predict_range=currentPredictRange,
    algorithm=currentAlgo);
}

function showGraphs(meter, date_time, predict_range, algorithm) {
  if (!graphsEnabled) {
    console.log("Try again soon");
    return;
  }
  console.log("Updating graph for meter: " +meter + ", date: " + date_time +
  ", predict_range: "+ predict_range + ", algorithm: " + algorithm);
  // console.log(trueValuesInvert[meter]);

  truth = trueValuesInvert[meter];
  predicted = ((predictionDataInvert[algorithm])[predict_range])[meter];
  difference = new Array(truth.length);
  for (index = 0; index < truth.length; index += 1) {
    difference[index] = [index,(predicted[index][1] - truth[index][1])];
  }
  // console.log(difference);
  $.plot("#graph0", [truth, predicted]);
  $.plot("#graph1", [difference]);
  // drawChart(trueValuesInvert[0], 0);
}


$( function() {

});


$( function() {
  $.ajax({
          type: "GET",
          url: tempByZipUrl,
          dataType: "text",
          success: function(data) {
            // console.log(data);
            temperature = $.csv.toObjects(data);
            // console.log(temperature);
          }
       });
   $.ajax({
           type: "GET",
           url: loadTrueUrl,
           dataType: "text",
           success: function(data) {
            //  console.log(data);

             lines = data.split('\n');
             for (index = 1; index < lines.length; index += 1) {
               parsed = lines[index].split(',');
               numbered = new Array(100);
               for (datum = 1; datum < parsed.length; datum += 1) {
                 flo = parseFloat(parsed[datum])
                numbered[datum-1] = flo;
                (trueValuesInvert[datum-1])[index-1] = [index-1,flo];
               }
               trueValues[parsed[0]] = numbered;

             }
            //  console.log(lines[0]);
            //  $.each(lines, function(line){
            //     console.log(line);
            //   });
            //  trueValues = $.csv.toArrays(data);
             // console.log(temperature);
           }
        });
    // Load all the data
    setTimeout(function (){
      algorithmTypes.forEach(function(algo) {
        predictionData[algo] = {};
        predictionDataInvert[algo] = {};
        hoursInDay.forEach(function (hour) {
          ((predictionData[algo])[hour]) = {};
          ((predictionDataInvert[algo])[hour]) = new Array(100);
          for(index = 0; index < 100; index +=1) {
            ((predictionDataInvert[algo])[hour])[index] = new Array(720);
          }

          $.ajax({
                  type: "GET",
                  url: algorithmBaseUrl+algo+"/"+hour+"h_"+algo+".csv",
                  dataType: "text",
                  success: function(data) {
                    // console.log(data);

                    lines = data.split('\n');
                    for (index = 1; index < lines.length; index += 1) {
                      parsed = lines[index].split(',');
                      numbered = new Array(100);
                      for (datum = 1; datum < parsed.length; datum += 1) {
                        flo = parseFloat(parsed[datum])
                       numbered[datum-1] = flo;
                       (((predictionDataInvert[algo])[hour])[datum-1])[index-1] = [index-1,flo];
                      }
                      ((predictionData[algo])[hour])[parsed[0]] = numbered;

                    }
                    // console.log(lines[0]);


                    (predictionData[algo])[hour] = data;
                    // console.log(temperature);
                    graphsEnabled = true;
                  }
               });
        })
      });
    }, 2000);

});


$('#single_cal2').daterangepicker({
          singleDatePicker: true,
          calender_style: "picker_2",
          startDate: '11-01-2011'
        }, function(start, end, label) {
          currentDate = start.toISOString().substr(0,10);
          updateGraphs();
          // console.log(start.toISOString(), end.toISOString(), label);
        });


$( function() {
  var handle = $( "#starting-slider-handle" );
  $( "#starting-slider" ).slider({
    min: 0,
    max: 99,
    step: 1,
    create: function() {
      handle.text( $( this ).slider( "value" ) );
      currentMeter = $( this ).slider( "value" );
    },
    slide: function( event, ui ) {
      handle.text( ui.value );
      currentMeter = ui.value;
      updateGraphs();
    }
  });
} );

$( function() {
  var handle = $( "#predict-slider-handle" );
  $( "#predict-slider" ).slider({
    min: 1,
    max: 24,
    step: 1,
    create: function() {
      handle.text( $( this ).slider( "value" ) );
      currentPredictRange = $( this ).slider( "value" );
    },
    slide: function( event, ui ) {
      handle.text( ui.value );
      currentPredictRange = ui.value;
      updateGraphs();
    }
  });
} );


$( function() {
  $( "#zips" ).selectmenu({
    change: function( event, data ) { currentZip = data.item.value; updateGraphs(); }});
  $( "#algors" ).selectmenu({
    change: function( event, data ) { currentAlgo = data.item.value; updateGraphs(); }});
//     var availableTags = [
// 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99    ];
//     $( "#tags" ).val('4').selectmenu({
//       source: availableTags
//     });
    // $.getJSON( "api/meter/", function(data) {
    //   availableTags = data;
    //   $( "#tags" ).autocomplete({
    //     source: availableTags
    //   }).val('meter_20').data('autocomplete');
    // });
  } );

// $( function() {
//   labels = {"0":"Real Time", "1":"+15 Minutes", "2":"+30 Minutes", "3":"+1 Hour",
//             "4":"+2 Hours", "5":"+3 Hours", "6":"+5 Hours", "7":"+1 Day", "8":"+2 Days"};
//   var handle2 = $( "#time-slider-handle" );
//   $( "#time-slider" ).slider({
//     min: 0,
//     max: 8,
//     step: 1,
//     create: function() {
//       handle2.text( labels[$( this ).slider( "value" )] );
//       currentTime = $( this ).slider( "value" );
//     },
//     slide: function( event, ui ) {
//       handle2.text( labels[ui.value] );
//       currentTime = ui.value;
//       // setSwitchStates(currentConfig, currentTime);
//     }
//   });
// } );


$( "#time-slider" ).slider({

            min: 0,
            max: 1435,
            step: 60,
            values: [600], //or whatever default time you want
            slide: function(e, ui) {
                var hours1 = Math.floor(ui.values[0] / 60);
                var minutes1 = ui.values[0] - (hours1 * 60);
                if(hours1.length == 1) hours1 = '0' + hours1;
                if(minutes1.length == 1) minutes1 = '0' + minutes1;
                if(minutes1 == 0) minutes1 = '00';

                if(hours1 >= 12){

                    if (hours1 == 12){
                        hours1 = hours1;
                        minutes1 = minutes1 + " PM";
                    } else if (hours1 == 24){
                        hours1 = hours1;
                        minutes1 = minutes1 + " AM";
                    } else{
                        hours1 = hours1 - 12;
                        minutes1 = minutes1 + " PM";
                    }
                }

                else{

                    hours1 = hours1;
                    minutes1 = minutes1 + " AM";
                }
                if (hours1 == 0){
                    hours1 = 12;
                    minutes1 = minutes1;
                }
                currentTime = hours1+':'+minutes1+":00";
                $('.custom-handle').html(hours1+':'+minutes1);
                updateGraphs();
            }
    });
$('.custom-handle').html("10:00 AM");
// ##################### Disagg Business Logic




// function populateRegions(endpoint, layerGroup, predict_state) {
//   console.log("populateRegions");
//   $.getJSON( endpoint, function(elements, error) {
//     console.log("Got Data");
//     console.log(elements);
//     elements.forEach(function(element) {
//       console.log(element.points);
//       layerGroup.addLayer(L.polygon(element.points, {color: region_colors[element.group_num]}))
//     });
//   });
// }



function onEachFeature(feature, layer) {
  console.console.log("On Each Feature " +feature);
}


var geojson;
function populateRegions(region_geo_json, layerGroup) {
  console.log("Populate" + region_geo_json);
  geojson=L.geoJSON(region_geo_json, {
      style: function(feature) {
          switch (feature.properties.region) {
              case '1': return {color: "#ff0000"};
              case '2':   return {color: "#0000ff"};
          }
      },
      onEachFeature: function(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: clickDrawGraph
        });
      }
  });
  console.log("Populate Created");
  layerGroup.addLayer(geojson);


}


// maps.forEach(function(map){
//
//   $.getJSON( "/static/data/model.geo.json", function(geo_json_data) {
//     var myLayer = L.geoJSON(geo_json_data, {
//         style: myStyle,
//         //onEachFeature: onEachFeature,
//         pointToLayer: function (feature, latlng) {
//           element_num = parseInt(feature.properties.name.split("_")[1]);
//           hexString = "#"+Math.min(element_num,255).toString(16) +"5400";
//           geojsonMarkerOptions.fillColor = hexString;
//           return L.circleMarker(latlng, geojsonMarkerOptions);
//         }
//     }).addTo(map);
//
//   });
// });
//
// var myStyle = {
//     "color": "#ff7800",
//     "weight": 5,
//     "opacity": 1
// };
//
// var geojsonMarkerOptions = {
//     radius: 9,
//     fillColor: "#ee5400",
//     color: "#000",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8
// };



function clickDrawGraph(e) {
      // e = event
      //console.log(feature.properties.region);
      // You can make your ajax call declaration here
      //$.ajax(...
        var layer = e.target;
        $.ajax({
            type: 'GET',
            url: 'PVAPI/'+layer.feature.properties.region,
            dataType: 'json',
            success: function (data) {
                        $.each(JSON.parse(data), function(key,value) {
                        drawChart(value,key);
                    });
                //console.log(data); // do anything you want with your parsed data
                      // for(var i=0; i<2; i++){
            }
        });
      //window.location.href = '/vader/PVDisagg/'+feature.properties.region
      }

function drawChart(dat,graphName) {
    var plotarea = $('#graph'+graphName);


    $.plot( plotarea , dat, { xaxis: {
                   // mode: "time",
                }
            });

};
//
//
// function clickDrawGraph(e) {
//       // e = event
//       //console.log(feature.properties.region);
//       // You can make your ajax call declaration here
//       //$.ajax(...
//         var layer = e.target;
//         $.ajax({
//             type: 'GET',
//             url: 'VoltageAPI/'+layer.feature.properties.region+"/7",
//             dataType: 'json',
//             success: function (data) {
//                         $.each(JSON.parse(data), function(key,value) {
//                           console.log("key " + key);
//                         drawChart(value,key);
//                     });
//                 //console.log(data); // do anything you want with your parsed data
//                       // for(var i=0; i<2; i++){
//             }
//         });
//       //window.location.href = '/vader/PVDisagg/'+feature.properties.region
//       }
//
// function drawChart(dat,graphName) {
//     var plotarea = $('#graph'+1);
//
//     console.log(dat);
//     console.log(graphName);
//     $.plot( plotarea , dat, { xaxis: {
//                   //  mode: "time",
//                 }
//             });
//
// };

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}
