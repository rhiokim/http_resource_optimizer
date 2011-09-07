var fs = require('fs');
var html = require('../../modules/html-minifier/src/htmlminifier');

var option = {
      removeComments:                 true, 
      removeCommentsFromCDATA:        true,
      removeCDATASectionsFromCDATA:   true,
      collapseWhitespace:             true,
      collapseBooleanAttributes:      true,
      removeAttributeQuotes:          true, 
      removeRedundantAttributes:      true,
      useShortDoctype:                true,
      removeEmptyAttributes:          true,
      removeEmptyElements:            true, 
      removeOptionalTags:             true,
      removeScriptTypeAttributes:     true,
      removeStyleLinkTypeAttributes:  true,
      lint:                           null 
    };

fs.readFile('./test.html','utf8', function(err, data){
   var res, 
       saving,
       diff; 

   res = html.minify(data, option);
   fs.writeFile('test-compressed.html', res, 'utf8');

   diff = data.length - res.length;
   saving = data.length ? ((100 * diff) / data.length).toFixed(2) : 0;
   console.log(data.length, '->', res.length, saving+'% saved');
});
