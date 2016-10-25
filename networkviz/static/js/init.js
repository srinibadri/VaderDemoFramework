$(document).ready(function(){
    var $simulationList = ['ieee123', 'ieee123s', 'ieee123z', 'ieee123zs'];
    var $simulationName = $('#simulation-name').text();

    $('.dropdown-toggle').click(function(){
        var $options = "";
        for (var i = 0; i < $simulationList.length; i++){
            if ($simulationName != $simulationList[i]){
                $options += '<li><a>' + $simulationList[i] + '</a></li>';
                $('.dropdown-menu').html($options);
            }
        }
    });

    $(document).on('click', '.dropdown-options li a', function () {
        var $changeModel = $(this).text();
        // Send AJAX to reload the whole page
    });

});