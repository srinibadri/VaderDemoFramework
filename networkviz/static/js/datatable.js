$(document).ready(function(){

    var $simulationName = 'ieee123';

    // Get "meter" when page is rendered default
    queryDataTable("meter", $simulationName);

    $('.table-tab').click(function () {
        $('.nav-tabs').children().removeClass("active");
        $(this).parent().addClass("active");

        var $tableName = $(this).text().toLowerCase();
        console.log("Open " + $tableName + " table");
        queryDataTable($tableName, $simulationName);
    });

    function queryDataTable($tableName, $simulationName){
        $.ajax({
            "url" : "/vader/datatable",
            "contentType" : "application/json",
            "type" : "GET",
            "data" : {
                "simulation_name": $simulationName,
                "database": 'data',
                "field": 'DISTINCT name',
                "table": $tableName
            },
            success : function(data){
                var icon =  '<div class="col-md-6">' +
                    '<a onclick="graphConfig(30, 100, "90 B", "line", "Voltage (V)")" data-toggle="modal" data-target="#graph"><i class="fa fa-history graph-icon" aria-hidden="true"></i></a>' +
                    '</div>' +
                    '<div class="col-md-6">' +
                    '<a onclick="graphConfig(30, 100, "90 B", "line", "Voltage (V)")" data-toggle="modal" data-target="#graph"><i class="fa fa-line-chart graph-icon" aria-hidden="true"></i></a>' +
                    '</div>';
                for (var i = 0; i < data.length; i++) {
                    data[i].push('IN_SERVICE');
                    data[i].push(icon);
                    data[i].push(icon);
                    data[i].push(icon);
                    data[i].push(icon);
                }
                $('#meter-table').DataTable(
                    {
                        destroy: true,
                        "columns": [
                            { className: "table-name" },
                            { className: "table-status" },
                            { className: "table-attr" },
                            { className: "table-attr" },
                            { className: "table-attr" },
                            { className: "table-attr" }

                        ],
                        data: data
                    });
            },
            error : function(err) {
                alert(err);
            }
        });
    }
});