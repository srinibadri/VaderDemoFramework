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
            icon =  '<a onclick=graphConfig(30, 100, "90 B", "line", "Voltage (V)") data-toggle="modal" data-target="#graph"><i class="fa fa-history graph-icon" aria-hidden="true"></i></a>' +
                '<a onclick="graphConfig(30, 100, "90 B", "line", "Voltage (V)")" data-toggle="modal" data-target="#graph"><i class="fa fa-line-chart graph-icon" aria-hidden="true"></i></a>';
            for (i = 0; i < data.length; i++) {
                data[i].push('IN_SERVICE');
                data[i].push(icon);
                data[i].push(icon);
                data[i].push(icon)
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
        }
    });
});