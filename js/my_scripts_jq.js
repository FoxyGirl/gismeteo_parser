/* jshint jquery: true */
/* jshint browser: true */
/* jshint devel: true */

$(document).ready(function() {
  $('#weatherShow').on('click', weatherHandler);
  
  var directoryName = 'anthropology';
  
  var newUrl = 'select * from html where url="https://www.gismeteo.by/weather-minsk-4248/month/"';
  /*
  var encoded = encodeURIComponent(str);
  
  console.log('encoded = ' + encoded);
  
  var urlH = "select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fdirectory.vancouver.wsu.edu%2Fanthropology%22%20and%20xpath%3D%22%2F%2Fdiv%5B%40id%3D'content-area'%5D%22";
  
  var decoded = decodeURIComponent(urlH);
  console.log('decoded = ' + decoded);  
  
  if (encoded === urlH) {
    console.log('Eha!');
  }
*/
$.ajax({
    type: 'GET',
   // url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fdirectory.vancouver.wsu.edu%2F"+directoryName+"%22%20and%20xpath%3D%22%2F%2Fdiv%5B%40id%3D'content-area'%5D%22",
    url: "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(newUrl),
  
    dataType: 'html',
    async: true,
    success: function(data) {
        $('#resultTable').append($(data).find('results').find('.forecast_frame'));
    },
    error: function () {
        alert('Извините на сервере произошла ошибка');
    }
});
  
  function weatherHandler() {
    console.log($(this));
  }
});