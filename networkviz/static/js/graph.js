function getHistoryData(dataset) {
    $.ajax({
        type: 'GET',
        data: {},
        url: '/vader/getdata/history',
        dataType: 'json',
        async: false,
        success: function(data) {
            console.log(data.length);
            for (var i = Math.max(0, data.length-672), j = 0; i < data.length; i++) {
                dataset.push({x: j++, y: data[i]});
            }
        }
    });
}

function getLiveData(category, name) {
    var result = '';
    $.ajax({
        type: 'GET',
        data: {
            category: category,
            name: name
        },
        url: '/vader/getdata/live',
        dataType: 'text',
        async: false,
        success: function(data) {
            result = data.substr(0, data.indexOf(' '));
        }
    });
    return result;
}

var realTimeInterval = [];

function graphHistory(title, style, ylabel) {
    document.getElementById('graghLabel').innerHTML = title;

    var dataset = [];

    getHistoryData(dataset);

    var margin = {top: 20, right: 20, bottom: 30, left: 60},

    width = 540 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain(d3.extent(dataset, function(d) { return d.x; }))
        .range([0, width]);


    var y = d3.scale.linear()
        .domain([d3.min(dataset, function(d) { return d.y; })-0.001, d3.max(dataset, function(d) { return d.y; })+0.001])
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

    var line = (style == 'line' ? d3.svg.line().interpolate("basis").x(function(d) { return x(d.x); }).y(function(d) { return y(d.y); })
        : d3.svg.area().interpolate("basis").x(function(d) { return x(d.x); }).y0(height).y1(function(d) { return y(d.y); }));
    d3.select("svg").remove();
    var svg = d3.select(".modal-body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


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

      svg.selectAll("path")
          .data([dataset])
          .attr("class", style)
          .attr("d", line);
}

function CapacitorGraph(category, style, ylabel) {
    document.getElementById('graghLabel').innerHTML = category;
    document.getElementById('graphArea').innerHTML = '';
    graphLive(category, 'voltage_A[V,2fM]', 'Voltage A', style, ylabel, 360, 240, 0.1);
    graphLive(category, 'voltage_B[V,2fM]', 'Voltage B', style, ylabel, 360, 240, 0.1);
    graphLive(category, 'voltage_C[V,2fM]', 'Voltage C', style, ylabel, 360, 240, 0.1);
    // 540, 320
}

function graphLive(category, name, title, style, ylabel, widthAbs, heightAbs, scale) {
    var dataset = [], i = 0;

    var margin = {top: 20, right: 20, bottom: 30, left: 60},
        width = widthAbs - margin.left - margin.right,
        height = heightAbs - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain(d3.extent(dataset, function(d) { return d.x; }))
        .range([0, width]);


    var y = d3.scale.linear()
        .domain([d3.min(dataset, function(d) { return d.y; })-scale, d3.max(dataset, function(d) { return d.y; })+scale])
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

    var line = (style == 'line' ? d3.svg.line().interpolate("basis").x(function(d) { return x(d.x); }).y(function(d) { return y(d.y); })
        : d3.svg.area().interpolate("basis").x(function(d) { return x(d.x); }).y0(height).y1(function(d) { return y(d.y); }));
    var svg = d3.select(".modal-body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")         // Add the Y Axis
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("x", (width / 2))             
          .attr("y", 0 - (margin.top / 3))
          .attr("text-anchor", "middle")  
          .style("font-size", "16px")  
          .text(title);
    svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .attr("font-size", "10px")
          .style("text-anchor", "end")
          .text(ylabel)
  

    svg.selectAll("path")
          .data([dataset])
          .attr("class", style)
          .attr("d", line);

    realTimeInterval.push(setInterval(function() {
        var result = getLiveData(category, name);
        if (result != '') {
            dataset.push({x: i++, y: Number(result)});
            if (dataset.length > 40)
                dataset.shift();
            x.domain(d3.extent(dataset, function(d) { return d.x; }));
            y.domain([d3.min(dataset, function(d) { return d.y; })-scale, d3.max(dataset, function(d) { return d.y; })+scale]);
            svg.select("g.y.axis").call(yAxis);
            svg.selectAll('path').data([dataset]).attr('class', style).attr('d', line);
        }
    }, 500));
}


$(document).on('click', '#closeGraph', function(){
    for (var i = 0; i < realTimeInterval.length; i++) {
        clearInterval(realTimeInterval[i]);
    }
    realTimeInterval = []
})
