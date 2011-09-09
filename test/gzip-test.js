var adapter = require('../../src/gzip').Gzip;
var gzip = new adapter();

gzip.on('complete', function(stdout){
   console.log('gzip completed');
});
gzip.compress('../example/www/js/TodoView.js');

