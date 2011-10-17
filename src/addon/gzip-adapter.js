var compress = require('../../lib/gzip');
var util = require('util');
var fs = require('fs');
var emitter = require('events').EventEmitter;

var gzipAdapter = function(){
   this.gzip = new compress.Gzip;
   this.gzip.init();

   emitter.call(this);
};

util.inherits(gzipAdapter, emitter);

extend(gzipAdapter.prototype, {
   compress : function(file){
      var res, 
         me = this;

      fs.readFile(file, 'binary', function(err, data){
         res = me.gzip.deflate(data, 'binary');
         me.emit('complete', res);
      });
   }
});

function extend(source, destination){
   for(var prop in destination) {
      source[prop] = destination[prop];
   }
}

exports.version = '0.0.1';
exports.Gzip = gzipAdapter;
