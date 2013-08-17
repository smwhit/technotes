var fs = require('fs');
var marked = require('marked'); 
var path = require('path');
var chokidar = require('chokidar');

var watcher = chokidar.watch('public/markdown/', {ignored: /^\./, persistent: true});

watcher
  .on('add', fileAdded)
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
	transformMarkdownToHtml(path);
}

function fileChanged(path){
	console.log('File', path, 'has been changed');
	transformMarkdownToHtml(path);
}

// Only needed if watching is persistent.
watcher.close();

function transformMarkdownToHtml(filePath)
{
	var fileName = path.basename(filePath);

	var htmlFileName = fileName.split('.')[0] + '.html';
	console.log(htmlFileName);

	var fileContents = fs.readFileSync(filePath, 'utf-8');
	var htmlFromMd = marked(fileContents);

	fs.writeFileSync('public/' + htmlFileName, htmlFromMd);
}