var exec = require('child_process').exec;
var emitter = require('events').EventEmitter;
var util = require('util');

var UglifyAdapter = function(options) {
   var opt = {};
   extend(opt, options || {});

   this._cmd = 'uglifyjs --no-copyright #{input}';
   this._export = '';

   emitter.call(this);
}

util.inherits(UglifyAdapter, emitter);

extend(UglifyAdapter.prototype, {
   compress : function(file) {
      var cmd = this._cmd.replace('#{input}', file);
      var me = this;

      console.log(cmd)

      exec(cmd, function(err, stdout, stderr){
         me.emit('complete', stdout);
      });
   }
});

function extend(source, destination){
   for(var prop in destination) {
      source[prop] = destination[prop];
   }
}

exports.version = '0.0.1';
exports.Uglify = UglifyAdapter;
