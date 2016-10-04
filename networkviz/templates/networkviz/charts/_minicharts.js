<script>
  $('document').ready(function() {
    $(".sparkline_one").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
      type: 'bar',
      height: '40',
      barWidth: 9,
      colorMap: {
        '7': '#a1a1a1'
      },
      barSpacing: 2,
      barColor: '#26B99A'
    });

    $(".sparkline_two").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
      type: 'line',
      width: '200',
      height: '40',
      lineColor: '#26B99A',
      fillColor: 'rgba(223, 223, 223, 0.57)',
      lineWidth: 2,
      spotColor: '#26B99A',
      minSpotColor: '#26B99A'
    });
  })
</script>
