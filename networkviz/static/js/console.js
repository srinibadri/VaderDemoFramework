$(document).ready(function(){

    queryStatus();
    queryFeeder();

    function queryStatus() {
        $.ajax({
            type: 'GET',
            url: '/vader/api/' + $simulationName + '/status',
            dataType: 'json',
            success: function(data) {
                items = [
                    { name: 'verbose', text: 'Verbose'},
                    { name: 'debug', text: 'Debug' },
                    { name: 'dumpall', text: 'Dumpall' },
                    { name: 'quiet', text: 'Quiet' },
                    { name: 'show_progress', text: 'Show progress' },
                    { name: 'suppress_repeat_messages', text: 'Suppress repeat messages' },
                    { name: 'warn', text: 'Warning' }
                ];
                for (var i = 0; i < items.length; i++) {
                    var html = '<div class="col-md-4 col-sm-4 col-xs-12 console-item">';
                    html += items[i].text;
                    html += '</div><div class="col-md-4 col-sm-4 col-xs-12 console-item">'
                    html += (data[items[i].name] == 'TRUE' ? 'open' : 'closed');
                    html += '</div><div class="col-md-4 col-sm-4 col-xs-12 console-item"><label class="toggle"><input type="checkbox"><div class="slider round"></div></label></div>';
                    $('.status-items').append(html);
                }
            }
        });
    }
    function queryFeeder(){
        $.ajax({
            type: 'GET',
            url: '/vader/api/' + $simulationName + '/feeder/',
            contentType: 'application/json',
            success: function(data) {
                $('.feeder-panel').html(data);
            },
            timeout: 3000
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
            type: 'GET',
            url: '/vader/api/' + $simulationName + '/switch/',
            contentType: 'application/json',
            timeout: 3000
        });
    }

    function queryCapacitor(){
        $.ajax({
            type: 'GET',
            url: '/vader/api/' + $simulationName + '/capacitor/',
            contentType: 'application/json',
            timeout: 3000
        });
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
