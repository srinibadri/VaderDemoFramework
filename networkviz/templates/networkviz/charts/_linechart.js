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

    ylabel = 'power(W)'

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
    d3.select("svg").remove();
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
});
</script>
