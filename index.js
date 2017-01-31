var http = require("http");
var fs = require("fs");

var server = http.createServer((req, res)=>{
	console.log("someone connected via HTTP");
	fs.readFile('index.html', 'utf-8',(error, fileData)=>{
		if(error){
			res.writeHead(500, {'content-type':'text/html'});
			res.end(error);
		}else{
			res.writeHead(200,{'content-type':'text/html'});
			res.end(fileData);
		}
	})
})

server.listen(8080);
console.log("Listening on port 8080");