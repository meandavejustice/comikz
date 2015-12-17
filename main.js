var fs = require('fs');
var vkey = require('vkey');
var Unrar = require('node-unrar');
var tmp = require('tmp');

var activeIndex = 0;
var tmpPath = '';
var globFiles = [];

tmp.setGracefulCleanup();

var h1 = document.querySelector('h1');
var img = document.querySelector('img');
document.querySelector('#prev').addEventListener('click', prev);
document.querySelector('#next').addEventListener('click', next);

function next() {
  if (activeIndex > globFiles.length -1) setPage(activeIndex = 0);
  else setPage(++activeIndex)
}

function prev() {
  if (activeIndex < 0) setPage(activeIndex = globFiles.length -1);
  else setPage(--activeIndex)
}

document.body.addEventListener('keydown', function(ev) {
  if (!globFiles.length || !tmpPath) return;

  if (vkey[ev.keyCode] === '<right>') next()
  if (vkey[ev.keyCode] === '<left>') prev();
}, false);

tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
  if (err) throw err;

  tmpPath = path;

  var rar = new Unrar('./facts.cbr');

  rar.extract(path, null, function (err) {
    fs.readdir(path, function(err, files) {
      globFiles = files;
      img.src = path+'/'+files[0];
    });
  });

  // Manual cleanup
  // cleanupCallback();
});

function setPage(i) {
  img.src = tmpPath+'/'+globFiles[i];
}
