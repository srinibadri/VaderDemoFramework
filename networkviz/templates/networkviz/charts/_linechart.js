<!-- Flot -->
<script>
$(document).ready(function() {
    var supply = [], demand = [];
    var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
    $.ajax({
        type: 'GET',
        data: {},
        url: '/vader/getdata/total-power',
        dataType: 'json',
        async: false,
        success: function(data) {
            for (var i = 0; i < 672; i++) {
                supply.push({x: parseDate(data[i].time), y: data[i].real_power/1000});
                demand.push({x: parseDate(data[i].time), y: data[i].demand/1000})
            }
        }
    });

    ylabel = 'power(kW)'

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = $("#canvas_dahs").width() - margin.left - margin.right,
        height = $("#canvas_dahs").height() - margin.top - margin.bottom;
    var x = d3.time.scale()
        .domain(d3.extent(demand, function(d) { return d.x; }))
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, d3.max(demand, function(d) { return d.y; })*1.05])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .innerTickSize(-height)
        .outerTickSize(0)
        .tickPadding(5);
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(5);

    var line = d3.svg.area().interpolate("basis").x(function(d) { return x(d.x); }).y0(height).y1(function(d) { return y(d.y); });
    var svg = d3.select("#canvas_dahs").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("path")
      .datum(demand)
      .attr("class", 'demand')
      .attr("d", line);

    svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)

    svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .attr("font-size", "10px")
          .style("text-anchor", "end")
          .text(ylabel);

    x.domain(d3.extent(supply, function(d) { return d.x; }));
    y.domain([0, d3.max(supply, function(d) { return d.y; })*1.05]);
    svg.append('path').datum(supply).attr('class', 'supply').attr('d', line);

    // heading panel statistics
    var curEff = supply[0].y * 100 / demand[0].y;
    var preEff = supply[1].y * 100 / demand[1].y;
    $('.generation-stat').html(addCommas(Math.floor(supply[0].y)));
    $('.demand-stat').html(addCommas(Math.floor(demand[0].y)));
    $('.efficiency-stat').html(Math.floor(curEff));
    var powerMax = supply[0].y, powerMin = supply[0].y, dateMax = supply[0].x, dateMin = supply[0].x;
    for (var i = 1; i < supply.length; i++) {
        if (supply[i].y >= powerMax) {
            powerMax = supply[i].y;
            dateMax = supply[i].x;
        }
        if (supply[i].y <= powerMin) {
            powerMin = supply[i].y;
            dateMin = supply[i].x;
        }
    }
    $('.max-generation').html(addCommas(Math.floor(powerMax)));
    $('.min-generation').html(addCommas(Math.floor(powerMin)));
    $('.generation-inc').html('<i class="' + (supply[0].y > supply[1].y ? 'green' : 'red') + '"><i class="fa fa-sort-' + (supply[0].y > supply[1].y ? 'asc' : 'desc') + '"></i>' + Math.ceil((Math.abs(supply[0].y-supply[1].y) * 100 / supply[1].y))+ '% </i> From last 15 minutes')
    $('.demand-inc').html('<i class="' + (demand[0].y > demand[1].y ? 'green' : 'red') + '"><i class="fa fa-sort-' + (demand[0].y > demand[1].y ? 'asc' : 'desc') + '"></i>' + Math.ceil((Math.abs(demand[0].y-demand[1].y) * 100 / demand[1].y))+ '% </i> From last 15 minutes')
    $('.efficiency-inc').html('<i class="' + (curEff > preEff ? 'green' : 'red') + '"><i class="fa fa-sort-' + (curEff > preEff ? 'asc' : 'desc') + '"></i>' + Math.ceil((Math.abs(curEff-preEff) * 100 / preEff))+ '% </i> From last 15 minutes')
    $('.max-generation-time').html('<i class="fa fa-clock-o"></i> ' + formatDate(dateMax));
    $('.min-generation-time').html('<i class="fa fa-clock-o"></i> ' + formatDate(dateMin));

});

function formatDate(date) {
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var date = new Date(date);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = '0' + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = '0' + date.getSeconds();
    // Will display time in 10:30:23 format
    var formattedTime = months[date.getMonth()] + '.' + date.getDate() + ' '
                        + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
</script>
