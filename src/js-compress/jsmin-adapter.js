var util = require('util');
var emitter = require('events').EventEmitter;
var jsmin = require('../../modules/node-jsmin/jsmin').jsmin;
var fs = require('fs');

var JSMinAdapter = function(options) {
   var opt = {};
   
   extend(opt, options || {});

   emitter.call(this);
};

util.inherits(JSMinAdapter, emitter);

extend(JSMinAdapter.prototype, {
   compress : function(file){
      var me = this;

      fs.readFile(file, function(err, data){
         var res = jsmin(data, 1);
         //me.emit('complete', res);
      });
   }
});


function extend(source, destination){
   for(var prop in destination) {
      source[prop] = destination[prop];
   }
}

exports.version = '0.0.1';
exports.JSMin = JSMinAdapter;
