$(document).ready(function(){
    var $simulationList = ['ieee123', 'ieee123s', 'ieee123z', 'ieee123zs'];
    var $simulationName = $('#simulation-name').text();
    
    $('.dropdown').click(function(){
        var $options = "";
        for (var i = 0; i < $simulationList.length; i++){
            if ($simulationName != $simulationList[i]){
                $options += '<li><a class="change-model">' + $simulationList[i] + '</a></li>';
                $('.dropdown-menu').html($options);
            }
        }
    });
    
});