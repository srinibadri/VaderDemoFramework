$(document).ready(function(){

    queryCards();

    function queryCards(){
        console.log("query for cards");
        $.ajax({
            "url" : "/vader/getdata/" + $simulationName + "/cards",
            "contentType" : "application/json",
            "type" : "GET",
            success: function(cardData){
                console.log(cardData);
                var $cardDataJson = cardData;
                var $totalLoads = $cardDataJson.load;
                var $totalHouses = $cardDataJson.house;
                var $totalNodes = $cardDataJson.node;
                console.log($totalHouses,$totalLoads,$totalNodes);
                $('.total-load').text($totalLoads);
                $('.total-house').text($totalHouses);
                $('.total-node').text($totalNodes);
            },
            error: function(err){
                console.log("Get cards data failed. " + err);
            },
            timeout: 16000
        });
    }
});
