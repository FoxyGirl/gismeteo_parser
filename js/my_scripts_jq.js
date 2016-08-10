/* jshint jquery: true */
/* jshint browser: true */
/* jshint devel: true */

$(document).ready(function() {
  $('#weatherShow').on('click', weatherHandler);
  
  function weatherHandler() {
    console.log($(this));
    var clickInput = $(this);
    
    var directoryName = 'anthropology';
  
    var newUrl = 'select * from html where url="https://www.gismeteo.by/weather-minsk-4248/month/"';
    
    $.ajax({
      type: 'GET',
     // url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fdirectory.vancouver.wsu.edu%2F"+directoryName+"%22%20and%20xpath%3D%22%2F%2Fdiv%5B%40id%3D'content-area'%5D%22",
      url: "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(newUrl),

      dataType: 'html',
      async: true,
      success: function(data) {
        $('#resultTable').append($(data).find('results').find('.forecast_frame'));

        var monthes = [];
        $('#resultTable').find('._monthName').each(function() {
          var name = $(this).find('h2').text();
          monthes.push($.trim(name));
        });
        console.log(monthes);

        var cellContent = $('.cell_content');
        console.log('cellContent = ' + cellContent.length);
        var newData = parseGismeteo(cellContent);
            console.log(JSON.stringify(newData));

      },
      error: function() {
          alert('Извините на сервере произошла ошибка');
      },
      beforeSend: function() {
        clickInput.prop('disabled', true);
      },
      complete: function() {
        clickInput.prop('disabled', false);
      }
    });
  }
  
  function parseGismeteo(cellContent) {
    var newData = [];
    //newData.push({'date' : []});
    cellContent.each(function(){
      var obj = {};
      var date = $(this).find('.date').find('a').text() || $(this).find('.date').text();
      obj.date = $.trim(date);
      var temp_max = $(this).find('.temp_max').find('.js_value').text();
      obj.temp_max = $.trim(temp_max);
      var temp_min = $(this).find('.temp_min').find('.js_value').text();
      obj.temp_min = $.trim(temp_min);
      newData.push(obj);
    });
    return newData;
  }
});