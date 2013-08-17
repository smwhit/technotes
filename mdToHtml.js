var fs = require('fs');
var marked = require('marked'); 
var path = require('path');

var filePath = 'public/markdown/wpf-behaviors.md';

//transformMarkdownToHtml(filePath);
//var watchPath = path.dirname('markdown');
var watchPath = path.dirname(__dirname + '/public/markdown/why');

console.log(watchPath);
fs.watch( watchPath , function(event, targetfile){
    console.log(path.normalize( targetfile ), 'is', event);
    transformMarkdownToHtml(targetfile);
    console.log('processed');
});

function transformMarkdownToHtml(filePath)
{
	var fileName = path.basename(filePath);

	var htmlFileName = fileName.split('.')[0] + '.html';
	console.log(htmlFileName);

	var fileContents = fs.readFileSync(filePath, 'utf-8');
	var htmlFromMd = marked(fileContents);

	fs.writeFileSync('public/' + htmlFileName, htmlFromMd);
}