var chokidar = require('chokidar');

var watcher = chokidar.watch('public/markdown/', {ignored: /^\./, persistent: true});

watcher
  //.on('add', function(path) { console.log('File', path, 'has been added');})
  .on('add', add)
  //.on('change', function(path) {console.log('File', path, 'has been changed');})
  .on('change', change)
  .on('unlink', function(path) {console.log('File', path, 'has been removed');})
  .on('error', function(error) {console.error('Error happened', error);})

// 'add' and 'change' events also receive stat() results as second argument.
// http://nodejs.org/api/fs.html#fs_class_fs_stats
watcher.on('change', function(path, stats) {
  console.log('File', path, 'changed size to', stats.size);
});

function add(path){
	console.log('File', path, 'has been added');
}

function change(path){
	console.log('File', path, 'has been changed');
}

//watcher.add('new-file');
//watcher.add(['new-file-2', 'new-file-3']);

// Only needed if watching is persistent.
watcher.close();