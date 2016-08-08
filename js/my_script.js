/* jshint browser: true */
/* jshint jquery: true */
/* jshint devel: true */

$(document).ready(function() {
  /*
var input = document.getElementById('weatherShow');
input.addEventListener('click', function(){
  var xhr = new XMLHttpRequest();
  //xhr.open('GET', 'https://www.gismeteo.by/weather-minsk-4248/month/');
  xhr.open('GET', 'https://developer.mozilla.org/ru/docs/Web/API/XMLHttpRequest');  // составить асинхронный (по умолчанию true) GET запрос страницы
  xhr.onreadystatechange = function () {  // обратная связь: отдаёт ответ на запрос
    if (this.readyState == 2) {  // в период, когда запрос уже отправлен, но полный ответ ещё не пришёл, самое время показывать иконку загрузки
      input.disabled=true;
    }
    if (this.readyState == 4 && this.status == 200) {  // отследить момент, когда пришёл полный ответ
      //var response = this.responseXML; 
      
      var response = xhr.responseText;
      console.log(typeof(response));
      console.log( response );  // this.responseText — ответ в виде текста
      input.disabled=false;
      //console.log(this.responseXML.querySelectorAll('li'));
    }
  };
  
  xhr.timeout = 10000;
  xhr.onload = function(e) {
    console.log('!!!!!!!!!');
    console.log(e);    
  };
  xhr.send(null);  // отправить запрос
  //console.log(xhr.responseXML.querySelectorAll('li'));
  
}, false);
  */
 // $('#result').load('https://www.gismeteo.by/weather-minsk-4248/month/ .weather_month');
 /* $(window).load(function(){
  var a = $('iframe').html();
  console.log('a = ' + a);
  });
  
  $('#weatherShow').on('click', function() {
     var a = $('iframe').contents();
    console.log('a = ' + a);
  });
  */
  $('#weatherShow').on('click', function() {
    $.ajax({
      url: 'https://www.gismeteo.by/weather-minsk-4248/month/',
      method: 'GET',
      headers: { },
      async: true,
      contentType: 'application/json',
      success: function(data){
        console.log(data);
      },
      error: function () {
                    alert('Извините на сервере произошла ошибка');
                }
    });
    
  });
 
});