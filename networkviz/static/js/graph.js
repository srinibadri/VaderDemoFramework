function fakeData(scale, oldData) {
    var seed = [5,8,13,12,16,21,18,23,24,28,25,30,32,36,40,38];
    var data = seed[Math.floor(Math.random()*seed.length)]*scale/28;
    if (data-oldData > 1)
        return oldData+1;
    else if (oldData > 1)
        return oldData-1;
    else
        return data;
}
function graphConfig(scale, dotNum, title, style, ylabel) {
    $('#graghLabel').replaceWith(title)
    var dataset = [{x:0, y: scale*0.1}]
    var i = 1;
    for (; i < dotNum; i++) {
        dataset.push({x: i, y: fakeData(scale, dataset[dataset.length-1].y)});
    }

    var margin = {top: 20, right: 20, bottom: 30, left: 50},

    width = 540 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain(d3.extent(dataset, function(d) { return d.x; }))
        .range([0, width]);


    var y = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) { return d.y; })])
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

    setInterval(function() {
        dataset.push({x: i++, y: fakeData(scale, dataset[dataset.length-1].y)});
        dataset.shift();
        x.domain(d3.extent(dataset, function(d) { return d.x; }));
        y.domain([0, d3.max(dataset, function(d) { return d.y; })]);
        svg.select("g.y.axis").call(yAxis);
        svg.selectAll('path').data([dataset]).attr('class', style).attr('d', line);
    }, 500);
}
