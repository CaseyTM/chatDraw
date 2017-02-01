
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8081, ()=>{
	console.log('Static server is runnin on port 8081')
});