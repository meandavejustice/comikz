var fs = require('fs');
var Unrar = require('node-unrar');
var tmp = require('tmp');
tmp.setGracefulCleanup();

var h1 = document.querySelector('h1');
var img = document.querySelector('img');

tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
  if (err) throw err;

  var rar = new Unrar('./facts.cbr');

  rar.extract(path, null, function (err) {
    console.log(err, path, rar);
    setTimeout(function() {
      fs.readdir(path, function(err, files){
        img.src = path+'/'+files[0];
        console.log(err, files);
      });
    }, 100);
  });

  // Manual cleanup
  // cleanupCallback();
});
