var chokidar = require('chokidar');

var watcher = chokidar.watch('public/markdown/', {ignored: /^\./, persistent: true});

watcher
  //.on('add', function(path) { console.log('File', path, 'has been added');})
  .on('add', fileAdded)
  //.on('change', function(path) {console.log('File', path, 'has been changed');})
  .on('change', fileChanged)
  .on('unlink', function(path) {console.log('File', path, 'has been removed');})
  .on('error', function(error) {console.error('Error happened', error);})

// 'add' and 'change' events also receive stat() results as second argument.
// http://nodejs.org/api/fs.html#fs_class_fs_stats
watcher.on('change', function(path, stats) {
  console.log('File', path, 'changed size to', stats.size);
});

function fileAdded(path){
	console.log('File', path, 'has been added');
}

function fileChanged(path){
	console.log('File', path, 'has been changed');
}

// Only needed if watching is persistent.
watcher.close();