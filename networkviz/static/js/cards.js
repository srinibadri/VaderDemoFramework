$(document).ready(function(){

    var $simulationName = 'ieee123';

    queryCards($simulationName);

    function queryCards($simulationName){
        $.ajax({
            "url" : "cards",
            "contentType" : "application/json",
            "type" : "GET",
            "data" : {
                "simulation_name": $simulationName
            },
            success: function(cardData){
                var cardDataJson = $.parseJSON(cardData);
                var $totalLoads = cardDataJson.load;
                var $totalHouses = cardDataJson.house;
                var $totalNodes = cardDataJson.node;
                $('.total-load').text($totalLoads);
                $('.total-house').text($totalHouses);
                $('.total-node').text($totalNodes);
            },
            error: function(err){
                console.log("Get cards data failed. " + err);
            }
        });
    }
});