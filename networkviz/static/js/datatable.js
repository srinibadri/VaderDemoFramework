$(document).ready(function(){

    var $simulationName = 'ieee123';

    // Get "meter" when page is rendered default
    queryDataTable("meter", $simulationName);

    $('.table-tab').click(function () {
        $('.nav-tabs').children().removeClass("active");
        $(this).parent().addClass("active");

        // "meter" "capacitor" "sensor" are available
        var $categoryName = $(this).text().toLowerCase();
        if($categoryName == 'capacitor'){
            $categoryName = 'cap';
        }
        console.log("Open " + $categoryName + " table");
        queryDataTable($categoryName, $simulationName);
    });

    function buildGraphIcon($categoryName, $itemName){
        var $icon = '<div class="col-md-6">';
        $icon += '<a onclick="graphHistory("ami", $categoryName, $itemName, "", "", "")" data-toggle="modal" data-target="#graph">';
        $icon += '<i class="fa fa-history graph-icon" aria-hidden="true"></i></a>';
        $icon += '</div>';

        $icon += '<div class="col-md-6">';
        $icon += '<a onclick="graphLive("", $categoryName, "", "", "", "")" data-toggle="modal" data-target="#graph">';
        $icon += '<i class="fa fa-history graph-icon" aria-hidden="true"></i></a>';
        $icon += '</div>';
        return $icon;
    }

    function queryDataTable($categoryName, $simulationName){
        $.ajax({
            "url" : "/vader/datatable",
            "contentType" : "application/json",
            "type" : "GET",
            "data" : {
                "simulation_name": $simulationName,
                "category": $categoryName
            },
            success : function(data){
                console.log(data);
                if($categoryName == 'meter') {
                    for (var i = 0; i < data.length; i++) {
                        var $icon = buildGraphIcon($categoryName, data[i][0]);
                        data[i].push($icon);
                        data[i].push($icon);
                        data[i].push($icon);
                        data[i].push($icon);
                    }
                    $('#meter-table').DataTable(
                        {
                            destroy: true,
                            "columns": [
                                {"title": "Name", className: "table-name"},
                                {"title": "Status", className: "table-status"},
                                {"title": "Demand", className: "table-attr"},
                                {"title": "Energy", className: "table-attr"},
                                {"title": "Voltage 1", className: "table-attr"},
                                {"title": "Voltage 2", className: "table-attr"}
                            ],
                            data: data
                        });
                }
                else if($categoryName == 'cap'){
                    console.log(data);
                    for (i = 0; i < data.length; i++) {
                        var $icon = buildGraphIcon($categoryName, data[i][0]);
                        data[i].push($icon);
                        data[i].push($icon);
                        data[i].push($icon);
                        data[i].push($icon);
                    }
                    $('#meter-table').DataTable(
                        {
                            destroy: true,
                            "columns": [
                                {"title": "Name", className: "table-name"},
                                {"title": "Status", className: "table-status"},
                                {"title": "Voltage A", className: "table-attr"},
                                {"title": "Voltage B", className: "table-attr"},
                                {"title": "Voltage C", className: "table-attr"},
                                {"title": "Voltage C", className: "table-attr", "visible": false}
                            ],
                            data: data
                        });
                }
                else{
                    console.log(data);
                    for (i = 0; i < data.length; i++) {
                        var $icon = buildGraphIcon($categoryName, data[i][0]);
                        data[i].push($icon);
                        data[i].push($icon);
                        data[i].push($icon);
                        data[i].push($icon);
                        data[i].push($icon);
                    }
                    $('#meter-table').DataTable(
                        {
                            destroy: true,
                            "columns": [
                                {"title": "Name", className: "table-name"},
                                {"title": "measured_voltage", className: "table-attr"},
                                {"title": "measured_current", className: "table-attr"},
                                {"title": "measured_power", className: "table-attr"},
                                {"title": "measured_power", className: "table-attr", "visible": false},
                                {"title": "measured_power", className: "table-attr", "visible": false}
                            ],
                            data: data
                        });
                }
            },
            error : function(err) {
                alert(err);
            }
        });
    }
});