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

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
    if (xhr.readyState == 4){
        data = xhr.responseText;
        }
    };
    xhr.send();
    console.log(data);
    
/*
    var query = "select * from html where url='"+ neededUrl +"'";
 */   
    var query = "select * from html where url=\"https://www.gismeteo.by/weather-minsk-4248/month/\" and xpath='//div[contains(@class,\"cell_content\")]'";

    // Define your callback:
    var callback = function(data) {
        //var post = data.query.results.item;
        //alert(post.title);
      var result = data.query.results;
        console.log(result);      
        // console.log(JSON.stringify(result));
        var newData = [];
        for (var i = 0, l = result['div'].length; i < l; i++) {
          console.log(result['div'][i]);
          console.log(result['div'][i]['div'][0]);
          
          //newData[i].date = result['div'][i]['div'][0]['a']['content'];
          newData[i] = {};
          newData[i]['date'] = result['div'][i]['div'][0]['a']['content'];
          console.log('date = ' + newData[i]['date']);
        }
        

    };

    // Instantiate with the query:
    var firstFeedItem = new YQLQuery(query, callback);

    // If you're ready then go:
    firstFeedItem.fetch(); // Go!!
  }