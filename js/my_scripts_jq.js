/* jshint jquery: true */
/* jshint browser: true */
/* jshint devel: true */

$(document).ready(function() {
  var helper = $('#helper');
  helper.hide();
  
  $('#weatherShow').on('click', weatherHandler);
  
  function weatherHandler() {
    var clickInput = $(this),    
        neededUrl = '"https://www.gismeteo.by/weather-minsk-4248/month/"',  
        newQuery = 'select * from html where url=' + neededUrl;
    
    $.ajax({
      type: 'GET',
      url: "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(newQuery),
      dataType: 'html',
      async: true,
      success: function(data) {
        if (data) {      
          helper.append($(data).find('results').find('.forecast_frame'));

          //find monthes
          var monthes = [];
          helper.find('._monthName').each(function() {
            var name = $(this).find('h2').text();
            monthes.push($.trim(name));
          });
          localStorage.setItem('monthes', JSON.stringify(monthes));

          //find required data
          var cellContent = helper.find('.cell_content');
          var newData = parseGismeteo(cellContent);
          localStorage.setItem('weather', JSON.stringify(newData));

          helper.empty();

          monthes = JSON.parse(localStorage.getItem('monthes'));
          newData = JSON.parse(localStorage.getItem('weather'));
          createTable(newData, monthes, $('#resultTable'));
        }
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

  function createTable(newData, monthArray, outElem) {
    var table = $('<table></table>'),
        tableThead = $('<thead></thead>'),
        tableTbody = $('<tbody></tbody>'),
        tableRow = $('<tr></tr>'),
        tableCell = $('<td></td>'),
        tableCellHead = $('<th></th>'),
        tableCellMonth = $('<td colspan="3"></td>'),
        month_1 = monthArray[0],
        month_2,
        datePrev = 0,
        dateNew;
    
    //Create thead
    var thArray = ['Date', 'Temp max', 'Temp min'];
    var newRow = tableRow.clone();
    for  (var i = 0, l = thArray.length;  i < l; i++ ) {
      newRow.append(tableCellHead.clone().text(thArray[i]));
    }
    
    table.append(tableThead.append(newRow));
    
    //Create tbody
    tableTbody.append(tableRow.clone()
              .append(tableCellMonth.clone().text(month_1)));
    
    for ( var i = 0, l = newData.length; i < l; i++ ) {
      dateNew = parseInt(newData[i].date, 10);
      if (( dateNew < datePrev ) && ( month_2 === undefined )) {
        tableTbody.append(tableRow.clone()
                  .append(tableCellMonth.clone().text(monthArray[1])));
      } 
      datePrev = dateNew;
      
      newRow = tableRow.clone();
      newRow.append(tableCell.clone().text(newData[i].date))
            .append(tableCell.clone().text(newData[i].temp_max))
            .append(tableCell.clone().text(newData[i].temp_min));
      
      tableTbody.append(newRow);     
    }
    
    table.append(tableTbody);    
    outElem.empty().append(table).show();
  }
});