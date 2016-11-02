$(".climate-tab").click(function() {

    queryWeather();

    function queryWeather() {
        console.log($simulationName);
        $.ajax({
            url: '/vader/api/' + $simulationName + '/climate',
            contentType: "application/json",
            type: "GET",
            success: function (climate) {
                $.each(climate,function(item) {
                    var idName = '#climate-' + item;
                    $(idName).text(climate[item]);
                });
            },
            error: function(err){
              console.log("Get Climate Failed");
              console.log(err);
            },
            timeout: 3000
        });
    }
});
