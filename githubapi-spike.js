var githubApi = require('github');
var fs = require('fs');
var github = new githubApi({ version:'3.0.0', timeout: 5000});
var path = require('path');
var marked = require('marked');

var repoPath = "public/markdown";
var repoName = "technotes";
var user = "smwhit";

github.authenticate({ type:"basic", username:"smwhit", password:process.env.github_pw});

var content = github.repos.getContent({user:user, repo:repoName, path:repoPath}, 
		function(err, resp){
			if(err) { 
				console.log('error');
				console.log(err);
			}
			else {
				var filenames = [];
				for (var i = 0; i < resp.length; i++) {
					filenames.push(resp[i].name);
					getFileFromGitHubAsString(resp[i].name, saveFile);
				};
			}
	}
);

console.log(content);

var saveFile = function(err, resp, callback) {
	if(err) console.log(err);
	else {
		fs.writeFileSync('public/markdown/' + resp.name, resp.text);
		callback(null, resp.name);
	}
};

function transformMarkdownToHtml(err, filePath)
{
	var fileName = repoPath + '/' + path.basename(filePath);
	console.log(fileName);

	var htmlFileName = filePath.split('.')[0] + '.html';
	console.log(htmlFileName);

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
	})
};