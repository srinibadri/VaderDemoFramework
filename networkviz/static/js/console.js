$(document).ready(function(){

    var $simulationName = 'ieee123';
    queryFeeder();

    function queryFeeder(){
        $.ajax({
            "url" : "api/feeder",
            "contentType" : "application/json",
            "type" : "GET",
            "data" : {
                "simulation_name": $simulationName
            },
            success: function(data) {
                $('.feeder-panel').html(data);
            }
        });
    }

    //Query fields separately
    // also encapsulate html in JS
    //Not succeed because error happened in backend when requesting two AJAXs

    // $.when(querySwitch(), queryCapacitor()).then(function(swList, capList){
    //     console.log(swList);
    //     console.log(capList);
    //     appendSwitch(swList);
    //     appendCapacitor(capList);
    // });

    function querySwitch(){
        $.ajax({
            "url" : "api/switch",
            "contentType" : "application/json",
            "type" : "GET"
        });
        console.log("haha");
    }

    function queryCapacitor(){
        $.ajax({
            "url" : "api/capacitor",
            "contentType" : "application/json",
            "type" : "GET"
        });
        console.log("hehe");
    }

    function appendSwitch(swList){
        var sw, innerHtml= "";
        for (var i = 0; i < swList.length; i++){
            sw = swList[i];
            innerHtml += '<div class="col-md-4 col-sm-4 col-xs-12 console-item">' + sw + '</div>' +
                '<div class="col-md-4 col-sm-4 col-xs-12 console-item">closed</div>'+
                '<div class="col-md-4 col-sm-4 col-xs-12 console-item">'+
                '<label class="toggle"><input type="checkbox"><div class="slider round"></div></label>'+
                '</div>';
        }
        $(".switch").append(innerHtml);
    }

    function appendCapacitor(capList){
        var cap, innerHtml= "";
        for (var i = 0; i < capList.length; i++){
            cap = capList[i];
            innerHtml += '<div class="col-md-3 col-sm-3 col-xs-12 console-item">' + cap +'</div>'+
                '<div class="col-md-3 col-sm-3 col-xs-12 console-item">closed</div>' +
                '<div class="col-md-3 col-sm-3 col-xs-12 console-item">' +
                '<label class="toggle"><input type="checkbox"><div class="slider round"></div></label></div>' +
                '<div class="col-md-3 col-sm-3 col-xs-12 console-item"><a onclick="CapacitorGraph(' + cap + ', "line", "Voltage (V)")" data-toggle="modal" data-target="#graph"><i class="fa fa-line-chart graph-icon" aria-hidden="true"></i></a></div>';
        }
        $(".capacitor").append(innerHtml);
    }

});
