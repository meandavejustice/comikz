var fs = require('fs');
var vkey = require('vkey');
var Unrar = require('node-unrar');
var tmp = require('tmp');
var escape = require('shell-escape');

var activeIndex = 0;
var tmpPath = '';
var globFiles = [];
var ctrlPressed = false;
var cleanup = function(){};

tmp.setGracefulCleanup();

var h1 = document.querySelector('h1');
var img = document.querySelector('img');
document.getElementById('prev').addEventListener('click', prev);
document.getElementById('next').addEventListener('click', next);

document.body.ondragover = function () {
  return false;
};

document.body.ondragleave = document.body.ondragend = function () {
  return false;
};

document.body.ondrop = function (e) {
  e.preventDefault();
  openCbr(e.dataTransfer.files[0]);
};

document.body.addEventListener('keydown', function(ev) {
  if (vkey[ev.keyCode] === '<control>') return ctrlPressed = true;

  if (globFiles.length && tmpPath) {
    if (vkey[ev.keyCode] === '<right>') next()
    if (vkey[ev.keyCode] === '<left>') prev();
  }

  // open file
  if (ctrlPressed && vkey[ev.keyCode] === 'O') document.getElementById('file').click();
}, false);


document.body.addEventListener('keyup', function(ev) {
  if (vkey[ev.keyCode] !== '<control>') return;
  else ctrlPressed = false;
}, false);

document.getElementById('open').addEventListener('click', function() {
  document.getElementById('file').click();
});

document.getElementById('file').addEventListener('change', function(ev) {
  openCbr(ev.target.files[0]);
});

function next() {
  if (activeIndex > globFiles.length -1) {
    setPage(activeIndex = 0);
    window.scrollTo(0,0);
  }
  else setPage(++activeIndex)
}

function prev() {
  if (activeIndex < 0) {
    setPage(activeIndex = globFiles.length -1);
    window.scrollTo(0,0);
  }
  else setPage(--activeIndex)
}

function openCbr(file, cb) {
  tmp.dir({unsafeCleanup: true}, function _tempDirCreated(err, path, cleanupCallback) {
    if (err) throw err;

    tmpPath = escape([path]);

    var rar = new Unrar(escape([file.path]));

    rar.extract(tmpPath, null, function (err) {
      if (err) throw err;
      fs.readdir(path, function(err, files) {
        globFiles = files;
        if (files.length) img.src = path+'/'+files[0];
        else img.src = 'https://media2.giphy.com/media/ErT9EdlI41A40/200_s.gif';
        if (cb) cb();
      });
    });

    cleanup();
    cleanup = cleanupCallback;
  });
}

function setPage(i) {
  img.src = tmpPath+'/'+globFiles[i];
}

window.addEventListener('unload', cleanup);
