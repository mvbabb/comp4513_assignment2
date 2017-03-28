/*

    -Same application token for everyone
    -if the app has the matching token for the authentication server then it verifies
    -if the app is valid(same as above) then verify the user for access
    -everyone is  an "admin level"
    -submit through the google drive (mbabb668), send a share link to Padma
    


*/

var request = require('request');
var express = require('express');
var bodyParse = require("body-parser");
var session = require('express-session');
var reader = require('fs');
var path = require('path');
var app=express();
//app.set('port', 3001);
app.use(express.static(path.join(__dirname)));
//app.use(express.static("application"));
//app.use(express.static("images"));
//app.use('/static', express.static('public'));
app.use(bodyParse.urlencoded({extended:false}));
app.use(session({resave:true, saveUninitialized: true, secret:"secret"}));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.get('/', function(req,res){
    res.sendFile(__dirname + "/YLN_app/index.html");
});

app.get('/readfile', function(req,res){
    var data = reader.readFileSync('index.html');
    res.send(data);
});
app.get('/newsfeed', function(req,res){
     res.sendFile(__dirname + "/YLN_app/newsfeed.html");
	 req.session.type = "Login";
	 console.log(req.session.type);
});

app.get("/error", function(req,res) {
        res.sendFile(__dirname + "/error.html");
        });
app.get("/css", function(req,res) {
        res.sendFile(__dirname + "/YLN_app/style.css");
        });
app.get("/yln-logo-white", function(req,res) {
        res.sendFile(__dirname + "/YLN_app/YourLiveNews_White.png");
        });
app.get("/yln-logo", function(req,res) {
        res.sendFile(__dirname + "/YLN_app/YourLiveNews.png");
        });

app.get("/secure", function(req,res) {
        res.sendFile(__dirname + "/secure.html");
        });

app.get("/home", function(req,res) {
        res.sendFile(__dirname + "/user_home.html");
        });
app.get("/sources", function(req,res) {
        res.sendFile(__dirname + "/sources.html");
        });

app.get("/topics", function(req,res) {
        res.sendFile(__dirname + "/topics.html");
        });
app.get("/about", function(req,res) {
        res.sendFile(__dirname + "/about.html");
        });

var userinfo={
    "user1":{
        "username":"admin",
        "password":"admin123#",
        "address":"info 1",
        "id":1
    },
        "user2":{
        "username":"user2",
        "password":"pwduser2",
        "address":"info 2",
        "id":2
    }
}




app.get('/login', function(req,res){
    
    
    var secureServer = app.listen(3002, function(){
    var secureHost = "10.239.32.182";
    var securePort = secureServer.address().port;
    console.log("Secure server started at http://%s:%s", secureHost, securePort);
    })});         
  
app.post('/saveUsername',function(req,res){
  if(req.session.uname){
	  req.session.uname = req.body.uname;
	  res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({"token": "success"}));
  }else{
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({"token": "fail"}));
  }
});
	
app.post('/info',function(req,res,next){
// Set the headers
var headers = {
    'User-Agent':       'MADS/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}
// Configure the request
var options = {
    url: 'http://localhost:3002/getInfo',
    method: 'POST',
    headers: headers,
    form: {'token': 'done'}
}
// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        req.session = body;
		console.log(req.session);
    }
})
});

app.post('/favorites',function(req,res){
  var session = req.session;
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({"token": "success", "favorites":session.favorites}));
});

app.post('/feeds',function(req,res){
  var session = req.session;
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({"token": "success", "favorites":session.feeds}));
});

app.post('/loggedIn',function(req,res){
  var session = req.session;
  if(session){
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({"token": "success", "favorites":session.logToken}));
  }
});

	
var server = app.listen(3001, function(){
    var host = "10.239.32.182";
    var port = server.address().port;
    console.log("Server started at http://%s:%s", host, port);
});