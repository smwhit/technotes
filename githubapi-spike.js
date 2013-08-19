var githubApi = require('github');
var fs = require('fs');
var github = new githubApi({ version:'3.0.0', timeout: 5000});

var repoPath = "public/markdown";
var repoName = "technotes";
var user = "smwhit";

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

var saveFile = function(err, resp) {
	if(err) console.log(err);
	else {
		console.log(resp);
		fs.writeFileSync('public/markdown/' + resp.name, resp.text);
	}
};

var getFileFromGitHubAsString = function(filename, callback) {
	github.repos.getContent({user:"smwhit", repo:"technotes", path:"public/markdown/" + filename}, 
		function(err, resp)
	{
		if(err) { 
			console.log('error');
			console.log(err);
			callback(err, null);
		}
		else {
			var b = new Buffer(resp.content, 'base64')
			var markdown = { name: resp.name, text: b.toString()};
			callback(null, markdown);
		}
	})
};