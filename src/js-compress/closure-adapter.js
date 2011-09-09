var exec = require("child_process").exec;
var emitter = require('events').EventEmitter;
var util = require('util');

var ClosureAdapter = function(options) {
   var opt = {
   };
   extend(opt, options || {});

   this._cmd = 'java -jar ../../lib/google_closure_compiler.jar --js #{input}';
   this._export = ' --js_output_file ${output}';
   
   emitter.call(this);
}

/**
 * EventEmitter 상속
 */
util.inherits(ClosureAdapter, emitter);

/**
 * 구글 클로져 압축 도구
 */
extend(ClosureAdapter.prototype, {
   /**
    * @desc 전달된 파일을 압축한다.
    * @param {String} file
    */
   compress : function(file) {
      var cmd = this._cmd.replace('#{input}', file);
      var me = this;

      exec(cmd, function(err, stdout, stderr){
         me.emit('complete', stdout);
      });
   }
});


function extend(source, destination){
   for (var prop in destination) {
      source[prop] = destination[prop];
   }
}

exports.version = '0.0.1';
exports.ClosureAdapter = ClosureAdapter;
