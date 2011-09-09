var fs = require('fs'),
    util = require('util'),
    emitter = require('events').EventEmitter,
    JSHINT = require('../../modules/jshint/jshint').JSHINT;


var jshintAdapter = function(){

   emitter.call(this);  
};


util.inherits(jshintAdapter, emitter);

extend(jshintAdapter.prototype, {
   parse : function(file){
      var me = this;
      var res;

      fs.readFile(file, 'utf8', function(err, data){
         res = JSHINT(data);    

         if(!res){
            me.emit('complete', JSHINT.errors);
         }
      });
   }
});

function extend(source, destination){
   for(var prop in destination){
      source[prop] = destination[prop];
   }
}

exports.version = '0.0.1';
exports.jshint = jshintAdapter;
