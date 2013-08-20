var express = require('express'); 
var path = require('path');
var jade = require('jade');
var fs = require('fs');
var githubApi = require('github');
var path = require('path');
var marked = require('marked');

var github = new githubApi({ version:'3.0.0', timeout: 5000});
var repoPath = "public/markdown";
var repoName = "technotes";
var user = "smwhit";

var app = express(); 

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');
app.set('view options', {'layout': false});

github.authenticate({ type:"basic", username:"smwhit", password:process.env.github_pw});

var updateHtmlFromMarkdown = function(callback) {
		github.repos.getContent({user:user, repo:repoName, path:repoPath}, 
		function(err, resp){
			if(err) { 
				console.log('error: ' + err);
				callback(err);
			}
			else {
				for (var i = 0; i < resp.length; i++) {
					console.log(resp[i].name);
					getFileFromGitHubAsString(resp[i].name, saveFile);
				};
				callback(null, "All done");
			}
		}
)};

updateHtmlFromMarkdown(function(err, resp){
	console.log('init complete');
});

function transformMarkdownToHtml(err, filePath)
{
	var fileName = repoPath + '/' + path.basename(filePath);
	var htmlFileName = filePath.split('.')[0] + '.html';
	var fileContents = fs.readFileSync(fileName, 'utf-8');
	var htmlFromMd = marked(fileContents);
	fs.writeFileSync('public/' + htmlFileName, htmlFromMd);
}

var getFileFromGitHubAsString = function(filename, callback) {
	github.repos.getContent({user:"smwhit", repo:"technotes", path:"public/markdown/" + filename}, 
		function(err, resp)
		{
			if(err) { 
				console.log('error: ' +  err);
				callback(err, null);
			}
			else {
				var b = new Buffer(resp.content, 'base64')
				var markdown = { name: resp.name, text: b.toString()};
				callback(null, markdown, transformMarkdownToHtml);
			}
		});
};

var saveFile = function(err, resp, callback) {
	if(err) callback(err, null);
	else {
		fs.writeFileSync('public/markdown/' + resp.name, resp.text);
		callback(null, resp.name);
	}
};

app.get('/', function(req, res) {
	fs.readdir('public', function(error, files) {
		var output = [];
		for(var i = 0 ; i < files.length; i++)
		{
			if(files[i].indexOf('html')!=-1)
			{
				output.push({path : files[i], title: files[i].split('.')[0]});
			}
		}
		res.render('index', {files: output, title: "Tech Notes", secret: process.env.SECRET});
	}
)});

app.post('/update', function(req, res, callback) {
	console.log('post!');
	updateHtmlFromMarkdown(function(done){
		console.log(done);
		res.send(done);
		res.send('updated ok\n', 200);
	});

	// res.send('updated ok\n', 200);
});

var port = process.env.PORT || 8088;
app.listen(port); 
console.log('Listening on port ' + port);
