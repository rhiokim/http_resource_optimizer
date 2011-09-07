var exec = require('child_process').exec;
var util = require('util');
var emitter = require('events').EventEmitter;

var BaseAdapter = function(options){
   var opt = {};
   extend(opt, options || {});

   emitter.call(this);
};

util.inherits(BaseAdapter, emitter);

extend(BaseAdapter.prototype, {
   compress : function(file) {
      
   }
});

function extend(source, destination){
   for(var prop in destination) {
      source[prop] = destination[prop];
   }
}
