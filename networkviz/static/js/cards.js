$(document).ready(function(){

    var $simulationName = 'ieee123';

    queryCards($simulationName);

    function queryCards($simulationName){
        console.log("query for cards");
        $.ajax({
            "url" : "getdata/"+simulationName+"/cards",
            "contentType" : "application/json",
            "type" : "GET",
            success: function(cardData){
                console.log($simulationName + "ss");
                //var $cardDataJson = $.parseJSON(cardData);
                var $totalLoads = cardData.load;
                var $totalHouses = cardData.house;
                var $totalNodes = cardData.node;
                console.log($totalHouses);
                $('.total-load').text($totalLoads);
                $('.total-house').text($totalHouses);
                $('.total-node').text($totalNodes);
            },
            error: function(err){
                console.log("Get cards data failed. " + err);
            },
            timeout: 3000
        });
    }
});
