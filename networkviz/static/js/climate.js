$(".climate-tab").click(function() {

    queryWeather();

    function queryWeather() {
        $.ajax({
            "url": "climate",
            "contentType": "application/json",
            "type": "GET",
            success: function (climate) {
                $.each(climate,function(item) {
                    var idName = '#climate-' + item;
                    $(idName).text(climate[item]);
                });
            },
            error: function(err){
                alert("Get climate failed. " + err);
            }
        });
    }
});