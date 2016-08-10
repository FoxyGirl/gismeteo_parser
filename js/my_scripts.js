/* jshint browser: true */
/* jshint devel: true */
;(function() {
  var input = document.getElementById('weatherShow');
  
  input.addEventListener('click', fct);  
})();

var oldResult = "";


function YQLQuery(query, callback) {
    this.query = query;
    this.callback = callback || function(){};
    this.fetch = function() {

        if (!this.query || !this.callback) {
            throw new Error('YQLQuery.fetch(): Parameters may be undefined');
        }

        var scriptEl = document.createElement('script'),
            uid = 'yql' + (+new Date()),
            encodedQuery = encodeURIComponent(this.query.toLowerCase()),
            instance = this;

        YQLQuery[uid] = function(json) {
            instance.callback(json);
            delete YQLQuery[uid];
            document.body.removeChild(scriptEl);
        };

        scriptEl.src = 'http://query.yahooapis.com/v1/public/yql?q=' + encodedQuery + '&format=json&callback=YQLQuery.' + uid; 
        document.body.appendChild(scriptEl);

    };
} 

function fct() {
  console.log("!!!");
  var data = "",        
      clickInput = this,
      neededUrl = 'https://www.gismeteo.by/weather-minsk-4248/month/';

  clickInput.disabled = true;

 // var query = "select * from html where url='"+ neededUrl +"'";

  var query = "select * from html where url=\""+ neededUrl +"\" and xpath='//div[contains(@class,\"cell_content\")]'";

  // Define callback:
  var callback = function(data) {
    var result = data.query.results;
      console.log(result);
      //if result not be changed do nothing
      if ( JSON.stringify(result) === oldResult) {
        clickInput.disabled = false;
        return;
      }
      oldResult = JSON.stringify(result);

      var newData = parseGismeteo(result);
       console.log('newData = ' + JSON.stringify(newData[10]));
      var outElem = document.getElementById('resultTable');
      createTable(newData, outElem);
      clickInput.disabled = false;
  };

  // Instantiate with the query:
  var firstFeedItem = new YQLQuery(query, callback);

  // If you're ready then go:
  firstFeedItem.fetch(); // Go!!
}

function trim(str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function parseGismeteo(resultJSON) {
  var result = resultJSON,
      newData = [],
      ANCHORS_COUNT = 10;
  for (var i = 0, l = result.div.length; i < l; i++) {
   // console.log(result['div'][i]);

    newData[i] = {};
    if ( i < ANCHORS_COUNT ) {
      newData[i].date = trim(result.div[i].div[0].a.content);
    } else {
      newData[i].date = trim(result.div[i].div[0].content);
    }
    
    newData[i].temp_max = trim(result.div[i].div[2].div[0].span.content);
    
    if ( i  === 0 ) {
      newData[i].temp_min = trim(result.div[i].div[2].div[1].span[1].content);
    } else {
      newData[i].temp_min = trim(result.div[i].div[2].div[1].span.content);
    }
    
  }
  
  //console.log('newData = ' + JSON.stringify(newData[10]));
  return newData;
}

function createTable(newData, outElem) {
  var fragment = document.createDocumentFragment(),
      table = document.createElement('table'),
      thead = document.createElement('thead'),
      tbody = document.createElement('tbody'),
      tr = document.createElement('tr'),
      now = new Date(),
      month_1  = now.getMonth(),
      month_2, 
      monthStr = ' / ' + (month_1 + 1),
      datePrev = 0,
      dateNew = 0;
  var th, trTbody, tdDate, tdTempMax, tdTempMin;
  
  //Create thead
  var thArray = ['Date', 'Temp max', 'Temp min'];
  
  for ( var i = 0; i < thArray.length; i++ ) {
    th = document.createElement('th');
    th.appendChild(document.createTextNode(thArray[i]));
    tr.appendChild(th);
  }
  
  thead.appendChild(tr);
  table.appendChild(thead);
  
  //Create tbody
  for ( var i = 0, l = newData.length; i < l; i++ ) {
    trTbody = document.createElement('tr');
    
    tdDate = document.createElement('td');
    
    //correct month
    dateNew = parseInt(newData[i].date, 10);
    if (( dateNew < datePrev) && ( month_2 === undefined )) {
      monthStr = ' / ' + (month_1 + 2);
    }
    datePrev = dateNew;
    tdDate.appendChild(document.createTextNode(newData[i].date + monthStr));
    
    tdTempMax = document.createElement('td');    tdTempMax.appendChild(document.createTextNode(newData[i].temp_max)); 
    
    tdTempMin = document.createElement('td');    tdTempMin.appendChild(document.createTextNode(newData[i].temp_min));
    
    trTbody.appendChild(tdDate);
    trTbody.appendChild(tdTempMax);
    trTbody.appendChild(tdTempMin);    
    
    tbody.appendChild(trTbody);
  }
  
  table.appendChild(tbody);
  fragment.appendChild(table);
  
  outElem.innerHTML = '';
  outElem.appendChild(table);
}