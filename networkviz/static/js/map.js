


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

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
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

// Create an element to hold all your text and markup
var container = $('#energy-map');

// Delegate all event handling for the container itself and its contents to the container
container.on('click', '.seeDetailsLink', function() {
    alert("clicked");
});


// Delegate all event handling for the container itself and its contents to the container
container.on('ready', '.seeDetailsLink', function() {
    alert();
});

var poppop;
mymap.on('popupopen', function(e) {
  var marker = e.popup._source;
  poppop = marker;
  pop_name = marker.feature.properties.name;
  // $.getJSON( "http://gridlabd.slac.stanford.edu:6267/json/"+pop_name+"/voltage_1", function( datar) {
  //   e.popup.setContent(datar).update();
  //
  // });

  // contents = "<br><br><h3>"+marker.feature.properties.name+"</h3><br><table id=\"element_table\"></table>";

  $.getJSON( "http://localhost:8000/networkviz/api/"+pop_name+"", function( datar) {
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

    // alert("Popup: " + marker);
    e.popup.setContent(contents + sparkline_contents).update();
    // $("#element_table").appendChild(tbl_body);
    // e.popup.update();
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




  //
  // contents = "<br><br><h3>meter_198</h3><br>\
  //   <TABLE>\
  //   <CAPTION>triplex_meter #1056</CAPTION>\
  //   <TR><TH WIDTH=\"35\" ALIGN=LEFT>Property<HR></TH>\
  //   <TH WIDTH=\"35\" COLSPAN=2 ALIGN=CENTER><NOBR>Line 1</NOBR><HR></TH>\
  //   <TH WIDTH=\"35\" COLSPAN=2 ALIGN=CENTER><NOBR>Line 2</NOBR><HR></TH>\
  //   <TH WIDTH=\"35\" COLSPAN=2 ALIGN=CENTER><NOBR>Neutral</NOBR><HR></TH>\
  //   </TR>\
  //   <TR><TH ALIGN=LEFT>Voltage</TH>\
  //   <TD ALIGN=RIGHT ><NOBR>0.122</NOBR></TD><TD ALIGN=LEFT>kV</TD>\
  //   <TD ALIGN=RIGHT ><NOBR>0.122</NOBR></TD><TD ALIGN=LEFT>kV</TD>\
  //   <TD ALIGN=RIGHT ><NOBR>0.000</NOBR></TD><TD ALIGN=LEFT>kV</TD>\
  //   </TR>\
  //   <TR><TH ALIGN=LEFT>&nbsp</TH>\
  //   <TD ALIGN=RIGHT ><NOBR>-2.663</NOBR></TD><TD ALIGN=LEFT>&deg;</TD>\
  //   <TD ALIGN=RIGHT ><NOBR>-2.660</NOBR></TD><TD ALIGN=LEFT>&deg;</TD>\
  //   <TD ALIGN=RIGHT ><NOBR>0.000</NOBR></TD><TD ALIGN=LEFT>&deg;</TD>\
  //   </TR>\
  //   <TR><TH ALIGN=LEFT>Power</TH>\
  //   <TD ALIGN=RIGHT ><NOBR>4.230</NOBR</TD><TD ALIGN=LEFT>kW</TD>\
  //   <TD ALIGN=RIGHT ><NOBR>4.062</NOBR</TD><TD ALIGN=LEFT>kW</TD>\
  //   <TD ALIGN=RIGHT ><NOBR>-0.000</NOBR</TD><TD ALIGN=LEFT>kW</TD>\
  //   </TR>\
  //   <TR><TH ALIGN=LEFT>Power</TH>\
  //   <TD ALIGN=RIGHT ><NOBR>0.708</NOBR</TD><TD ALIGN=LEFT>kVAR</TD>\
  //   <TD ALIGN=RIGHT ><NOBR>0.718</NOBR</TD><TD ALIGN=LEFT>kVAR</TD>\
  //   <TD ALIGN=RIGHT ><NOBR>0.000</NOBR</TD><TD ALIGN=LEFT>kVAR</TD>\
  //   </TR>\
  //   <TR><TH>&nbsp;</TH><TH ALIGN=CENTER COLSPAN=6>Total<HR/></TH></TR><TR><TH ALIGN=LEFT>Power</TH>\
  //   <TD ALIGN=CENTER COLSPAN=6 ><NOBR>8.293&nbsp;kW</NOBR</TD>\
  //   </TR>\
  //   <TR><TH ALIGN=LEFT>Energy</TH><TD ALIGN=CENTER COLSPAN=6 ><NOBR>2.729&nbsp;kWh</NOBR</TD>\
  //   </TR>\
  //   </TABLE>";


});


$.getJSON( "/static/data/model.geo.json", function( datar) {
  geo_json_data = datar;
  var myLayer = L.geoJSON(geo_json_data, {
      style: myStyle,
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        element_num = parseInt(feature.properties.name.split("_")[1]);
        console.log(element_num);
        hexString = "#"+element_num.toString(16) +"5400";
        geojsonMarkerOptions.fillColor = hexString;
        return L.circleMarker(latlng, geojsonMarkerOptions);
      }
  }).addTo(mymap);

});


console.log("Done");
