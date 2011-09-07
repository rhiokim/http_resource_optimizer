var util = require('util');
var emitter = require('events').EventEmitter;
var cssmin = require('../../modules/node-css-compressor').cssmin;
var fs = require('fs');

var CssMinAdapter = function(options) {
   var opt = {};
   
   extend(opt, options || {});

   emitter.call(this);
};

util.inherits(CssMinAdapter, emitter);

extend(CssMinAdapter.prototype, {
   compress : function(file){
      var me = this;

      fs.readFile(file, function(err, data){
         var res = cssmin(data);
         me.emit('complete', res);
      });
   }
});


function extend(source, destination){
   for(var prop in destination) {
      source[prop] = destination[prop];
}

exports.version = '0.0.1';
exports.CssMin = CssMinAdapter;
