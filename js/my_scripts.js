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
  var result = resultJSON;
  var newData = [];
  for (var i = 0, l = result.div.length; i < l; i++) {
   // console.log(result['div'][i]);

    newData[i] = {};
    if ( i < 10 ) {
      newData[i].date = trim(result.div[i].div[0].a.content);
    } else {
      newData[i].date = trim(result.div[i].div[0].content);
    }
    
    newData[i].temp_max = trim(result.div[i].div[2].div[0]['data-value']);
    
    newData[i].temp_min = trim(result.div[i].div[2].div[1]['data-value']);
    
  }
  
  //console.log('newData = ' + JSON.stringify(newData[10]));
  return newData;
}

function createTable(newData, outElem) {
  var fragment = document.createDocumentFragment();
  var table = document.createElement('table');
  var thead = document.createElement('thead');
  var tbody = document.createElement('tbody');
  var tr = document.createElement('tr');
  
  //Create thead
  var thArray = ['Date', 'Temp max', 'Temp min'];
  
  for ( var i = 0; i < thArray.length; i++ ) {
    var th = document.createElement('th');
    th.appendChild(document.createTextNode(thArray[i]));
    tr.appendChild(th);
  }
  
  thead.appendChild(tr);
  table.appendChild(thead);
  
  //Create tbody
  for ( var i = 0, l = newData.length; i < l; i++ ) {
    var trTbody = document.createElement('tr');
    
    var tdDate = document.createElement('td');
    tdDate.appendChild(document.createTextNode(newData[i].date));
    
    var tdTempMax = document.createElement('td');    tdTempMax.appendChild(document.createTextNode(newData[i].temp_max)); 
    
    var tdTempMin = document.createElement('td');    tdTempMin.appendChild(document.createTextNode(newData[i].temp_min));
    
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