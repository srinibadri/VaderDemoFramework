$(document).ready(function(){
    console.log("in");
    $.ajax({
        "url" : "/vader/datatable",
        "contentType" : "application/json",
        "type" : "GET",
        "data" : {
            "simulation_name": 'ieee123',
            "database": 'data',
            "field": 'DISTINCT name',
            "table": 'meter'
        },
        success : function(data){
            icon =  '<div class="col-md-6">' +
                '<a onclick="graphConfig(30, 100, "90 B", "line", "Voltage (V)")" data-toggle="modal" data-target="#graph"><i class="fa fa-history graph-icon" aria-hidden="true"></i></a>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<a onclick="graphConfig(30, 100, "90 B", "line", "Voltage (V)")" data-toggle="modal" data-target="#graph"><i class="fa fa-line-chart graph-icon" aria-hidden="true"></i></a>' +
                '</div>';
            for (i = 0; i < data.length; i++) {
                data[i].push('IN_SERVICE');
                data[i].push(icon);
                data[i].push(icon);
                data[i].push(icon);
                data[i].push(icon);
            }
            console.log(data);
            $('#meter-table').DataTable(
                {
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
});