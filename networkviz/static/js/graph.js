function getHistoryData(dataset, database, table, field, condition) {
    $.ajax({
        type: 'GET',
        data: {
            database: database,
            table: table,
            field: field,
            condition: condition
        },
        url: "/vader/getdata/"+$simulationName+"/history",
        dataType: 'json',
        async: false,
        success: function(data) {
            //interval = Math.ceil(Math.max(1, data.length / 200));
            //console.log(interval)
            for (var i = 0, j = 0; i < data.length; i++) {
                dataset.push({x: j++, y: data[i]});
            }
        },
        timeout: 3000
    });
}

function getYLabel(column) {
    if (column == 'Energy') {
        return column + ' (Wh)';
    } else if (column == 'Power' || column == 'Demand'){
        return 'Power (W)'
    } else if (column == 'Current') {
        return 'Current (A)'
    } else {
        return 'Voltage (V)';
    }
}

function getLiveData(category, name) {
    var result = '';
    $.ajax({
        type: 'GET',
        data: {
            category: category,
            name: name
        },
        url: "/vader/getdata/"+$simulationName+"/live",
        dataType: 'text',
        async: false,
        success: function(data) {
            result = data.substr(0, data.indexOf(' '));
        },
        timeout: 3000
    });
    return result;
}

var realTimeInterval = [];

function graphHistory(table, name, column) {
    document.getElementById('graghLabel').innerHTML = name + ' ' + column + ' (Last 15 minutes)';
    document.getElementById('graphArea').innerHTML = '';
    var dataset = [];

    var db, simulation_name='ieee123', field, style='line', ylabel=getYLabel(column);
    var condition = 'where t >= DATE_SUB(CURDATE(), INTERVAL 15 MINUTE) and name="' + name + '"';

    switch(table) {
        case 'meter': db = 'ami'; break;
        case 'sensor': db = 'scada'; break;
        default: table = 'capacitor'; db = 'scada';
    }

    switch(column) {
        case 'Demand': field = 'cast(measured_demand as decimal(8,1))'; break;
        case 'Energy': field = 'cast(measured_real_energy as decimal(8,1))'; break;
        case 'Voltage 1': field = 'cast(measured_voltage_1 as decimal(8,2))'; break;
        case 'Voltage 2': field = 'cast(measured_voltage_2 as decimal(8,2))'; break;
        case 'Voltage': field = 'cast(measured_voltage as decimal(8,2))'; break;
        case 'Current': field = 'cast(measured_current as decimal(8,2))'; break;
        case 'Power': field = 'cast(measured_power as decimal(8,2))'; break;
        case 'Voltage A': field = 'cast(voltage_A as decimal(8,2))'; break;
        case 'Voltage B': field = 'cast(voltage_B as decimal(8,2))'; break;
        case 'Voltage C': field = 'cast(voltage_C as decimal(8,2))'; break;
    }

    getHistoryData(dataset, db, table, field, condition);

    var margin = {top: 20, right: 20, bottom: 30, left: 60},

    width = 1080 - margin.left - margin.right,
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
    var svg = d3.select("#graphArea").append("svg")
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

function graphLive(name, column) {
    document.getElementById('graghLabel').innerHTML = name + ' ' + column;
    document.getElementById('graphArea').innerHTML = '';
    var width = 1080 , height = 320;
    var style = 'line', scale, ylabel = getYLabel(column), item;
    switch(column) {
        case 'Demand': item = 'measured_demand[W,1fM]'; scale = 1; break;
        case 'Energy': item = 'measured_real_energy[Wh,2f]'; scale = 1; break;
        case 'Voltage 1': item = 'measured_voltage_1[V,3fM]'; scale = 0.01; break;
        case 'Voltage 2': item = 'measured_voltage_2[V,3fM]'; scale = 0.01; break;
        case 'Voltage': item = 'measured_voltage[V,3fM]'; scale = 0.1; break;
        case 'Current': item = 'measured_current[A,4fM]'; scale = 0.01; break;
        case 'Power': item = 'measured_power[W,1fM]'; scale = 1; break;
        case 'Voltage A': item = 'voltage_A[V,3fM]'; scale = 0.01; break;
        case 'Voltage B': item = 'voltage_B[V,3fM]'; scale = 0.01; break;
        case 'Voltage C': item = 'voltage_C[V,3fM]'; scale = 0.01; break;
    }
    graphLiveFormat(name, item, '', style, ylabel, width, height, scale);
}

function CapacitorGraph(name, style, ylabel) {
    document.getElementById('graghLabel').innerHTML = name;
    document.getElementById('graphArea').innerHTML = '';
    graphLiveFormat(name, 'voltage_A[V,2fM]', 'Voltage A', style, ylabel, 360, 240, 0.1);
    graphLiveFormat(name, 'voltage_B[V,2fM]', 'Voltage B', style, ylabel, 360, 240, 0.1);
    graphLiveFormat(name, 'voltage_C[V,2fM]', 'Voltage C', style, ylabel, 360, 240, 0.1);
}

function graphLiveFormat(name, column, title, style, ylabel, widthAbs, heightAbs, scale) {
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
    var svg = d3.select("#graphArea").append("svg")
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
        var result = getLiveData(name, column);
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
