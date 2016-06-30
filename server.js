require('dotenv').load();
var express = require('express');
var app = express();
var passport = require('passport');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var initPassport = require('./authenticate/init');
var router = require('./router/index');
var mongo = require('mongodb').MongoClient;
var path = require('path');
// Configuring application
app.use(cookieParser());
app.use(expressSession({secret: 'MysecretKey'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
// Static
app.use('/public', express.static(path.join(__dirname, process.env.PUBLIC_FOLDER)));


// Connect Database
//var mdb;
mongo.connect(process.env.DATABASE, function(err, db){
	if (err) throw err;
    router(app, db);
//	mdb = db;
// initpassport
	initPassport(app, passport, db);
});

var port = process.env.PORT;
app.listen(port, function(){
	console.log('Server is listening on port ' + port);
});

/*
process.stdin.resume();//so the program will not close instantly
function exitHandler(options, err) {
    if (options.cleanup) {
    	// Close Database;
    	mdb.close();
    	console.log('Exit');
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
*/