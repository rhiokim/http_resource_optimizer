var compress = require('../lib/gzip');
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
      var me = this;
console.log('1.compress exec');
      fs.readFile(file, 'binary', function(err, data){
         console.log('2.file read complete', data.length);
         var res = me.gzip.deflate(data, 'binary');
         console.log('3.gzip compressed', res);
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
