/* jshint jquery: true */
/* jshint browser: true */
/* jshint devel: true */

$(document).ready(function() {
  $('#weatherShow').on('click', weatherHandler);
  
  
  function weatherHandler() {
    console.log($(this));
  }
});