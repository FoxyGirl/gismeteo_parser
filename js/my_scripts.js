/* jshint browser: true */
/* jshint devel: true */
;(function() {
  var input = document.getElementById('weatherShow');
  
  input.addEventListener('click', fct);  
})();

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
    url = "",
    neededUrl = 'https://www.gismeteo.by/weather-minsk-4248/month/';

   // var query = "select * from html where url='"+ neededUrl +"'";
  
    var query = "select * from html where url=\""+ neededUrl +"\" and xpath='//div[contains(@class,\"cell_content\")]'";

    // Define your callback:
    var callback = function(data) {
        //var post = data.query.results.item;
        //alert(post.title);
      var result = data.query.results;
        console.log(result);      
        // console.log(JSON.stringify(result));

      parseGismeteo(result);
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
  for (var i = 0, l = result['div'].length; i < l; i++) {
   // console.log(result['div'][i]);

    newData[i] = {};
    if ( i < 10 ) {
      newData[i]['date'] = trim(result['div'][i]['div'][0]['a']['content']);
    } else {
      newData[i]['date'] = trim(result['div'][i]['div'][0]['content']);
    }
    
    newData[i]['temp_max'] = trim(result['div'][i]['div'][2]['div'][0]['data-value']);
    
    newData[i]['temp_min'] = trim(result['div'][i]['div'][2]['div'][1]['data-value']);
    
    console.log('date = ' + newData[i]['date']);
    console.log('temp_max = ' + newData[i]['temp_max']);
    console.log('temp_min = ' + newData[i]['temp_min']);
    
  }
  
  console.log('newData = ' + JSON.stringify(newData[10]));
}