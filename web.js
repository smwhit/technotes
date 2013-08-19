var express = require('express'); 
var app = express(); 
var path = require('path');
var jade = require('jade');
var fs = require('fs');

//app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root

app.set('view engine', 'jade');
app.set('view options', {'layout': false});

// app.configure('development', function(){
//   app.use(express.errorHandler());
//   app.locals.pretty = true;
// });

app.get('/', function(req, res) {
	console.log(process.env.SECRET);
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

var port = process.env.PORT || 8088;
app.listen(port); 
console.log('Listening on port ' + port);
