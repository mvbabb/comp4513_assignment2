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
var cookieParser = require('cookie-parser');
var reader = require('fs');
var path = require('path');
var app=express();
var morgan = require('morgan');
var atob = require('atob');
var btoa = require('btoa');
app.use(session({resave:false, saveUninitialized: true, secret:"secret"}));
//app.set('port', 3001);
app.use(express.static(path.join(__dirname)));
//app.use(express.static("application"));
//app.use(express.static("images"));
//app.use('/static', express.static('public'));
app.use(bodyParse.urlencoded({extended:false}));

app.use(morgan('dev'));

var headers = {
    'User-Agent':       'MADS/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
	}


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req,res){
	req.session.destroy();
    res.sendFile(__dirname + "/YLN_app/index.html");
});

app.get('/readfile', function(req,res){
    var data = reader.readFileSync('index.html');
    res.send(data);
});
app.get('/newsfeed', function(req,res){
	if(req.session.user){
     res.sendFile(__dirname + "/YLN_app/newsfeed.html");
	}else{
		res.sendFile(__dirname + "/YLN_app/index.html");
	}
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
		
var use;
var user;

app.get('/login', function(req,res){
    var secureServer = app.listen(3002, function(){
    var secureHost = "10.239.32.182";
    var securePort = secureServer.address().port;
    console.log("Secure server started at http://%s:%s", secureHost, securePort);
    })});

app.post('/saveUsername',function(req,res){
  if(user.user_name){
	  user.user_name = req.body.uname;
	  res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({"token": "success"}));
  }else{
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({"token": "fail"}));
  }
});


app.post('/new_feed', function(req, res){
	var usersession = req.session.user;
    console.log("adding new feed");
	console.log(req.body.new_feed_item);
	var newFeed = {};
	newFeed["feed_id"] = "000"+(usersession.feeds.length+1);
	newFeed["feed_name"] = req.body.feedName;
	var newData = [];
	console.log("LENGTH: " + req.body.new_feed_item.length);
    for (var x=0;x < req.body.new_feed_item.length; x++){
		newData.push(req.body.new_feed_item[x]);
    }
	newFeed["sources"] = newData;
	usersession.feeds[usersession.feeds.length] = newFeed;
	console.log(usersession);
	req.session.user = usersession;
	var headers = {
    'User-Agent':       'MADS/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}
var stringSession = JSON.stringify(usersession);
	var options = {
    url: 'http://localhost:3002/updateUser',
    method: 'POST',
    headers: headers,
    form: {user: stringSession}
}

	request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
		use = JSON.parse(body);
		console.log(use.token);
		if(use.token = "success"){
			req.session.user = usersession;
		}
		//res.setHeader('Content-Type', 'application/json');
		//res.send(JSON.stringify({"token": "success"}));
    }
})
     res.sendFile(__dirname + "/user_home.html");

});

app.post('/update_password', function(req, res){
		var newPwd = btoa(req.body.psw);
	var update = req.session.user;
	update.password = newPwd;
		var stringSession = JSON.stringify(update);
	var options = {
    url: 'http://localhost:3002/updateUser',
    method: 'POST',
    headers: headers,
    form: {user: stringSession}
}

	request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
		use = JSON.parse(body);
		console.log(use.token);
		if(use.token = "success"){
			req.session.user = update;
		}
    }
})
     res.sendFile(__dirname + "/user_home.html");			
});

app.post('/update_user', function(req, res){
		var update = req.session.user;
		var newPwd = btoa(req.body.psw);
		if(newPwd == update.password){
		update.user_name = atob(req.body.username);
		var stringSession = JSON.stringify(update);
	var options = {
    url: 'http://localhost:3002/updateUser',
    method: 'POST',
    headers: headers,
    form: {user: stringSession}
}
	request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
		use = JSON.parse(body);
		console.log(use.token);
		if(use.token = "success"){
			req.session.user = update;
		}
    }
})
     res.sendFile(__dirname + "/user_home.html");
		}else{
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({"token": "wrongPassword"}));
		}	 
});






app.post('/delete_favorites',function(req,res){
    console.log("Deleting Favorites");
	var toDelete = req.body.url;
	var update = req.session.user;
	for(var x = 0; x < update.favorites.length; x++){
		if(toDelete == update.favorites[x].url){
			console.log(update.favorites);
			update.favorites.splice(x,1);
			console.log(update.favorites);
		var stringSession = JSON.stringify(update);
	var options = {
    url: 'http://localhost:3002/updateUser',
    method: 'POST',
    headers: headers,
    form: {user: stringSession}
}

	request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
		use = JSON.parse(body);
		console.log(use.token);
		if(use.token = "success"){
			req.session.user = update;
		}
    }
})
     //res.sendFile(__dirname + "/user_home.html");	
    
		}
	
	}
    res.redirect("http://localhost:3001/newsfeed");
});


app.post('/delete_feed',function(req,res){
	var toDelete = req.body.feed;
	var update = req.session.user;
	for(var x = 0; x < update.feeds.length; x++){
		if(toDelete == update.feeds[x].feed_name){
			console.log(update.feeds);
			update.feeds.splice(x,1);
			console.log(update.feeds);
		var stringSession = JSON.stringify(update);
		
		
	var options = {
    url: 'http://localhost:3002/updateUser',
    method: 'POST',
    headers: headers,
    form: {user: stringSession}
}

	request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
		use = JSON.parse(body);
		console.log(use.token);
		if(use.token = "success"){
			req.session.user = update;
		}
    }
})
     res.sendFile(__dirname + "/user_home.html");				
		}
	
	}
});



app.post('/add_favorites', function(req, res){
	var usersession = req.session.user;
    console.log("adding new favorite");
	
	var newFave = {};
	newFave["author"] = req.body.author;
	newFave["description"] = req.body.description;
	newFave["publishedAt"] = req.body.publishedAt;
	newFave["title"] = req.body.title;
	newFave["url"] = req.body.url;
	newFave["urlToImage"] = req.body.urlToImage;
	usersession.favorites[usersession.favorites.length] = newFave;
	console.log(usersession);
	
var stringSession = JSON.stringify(usersession);
	var options = {
    url: 'http://localhost:3002/updateUser',
    method: 'POST',
    headers: headers,
    form: {user: stringSession}
}

	request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
		use = JSON.parse(body);
		console.log(use.token);
		if(use.token = "success"){
			req.session.user = usersession;
		}
    }
})
     //res.sendFile(__dirname + "/newsfeed.html"); I CHANGED THIS
    res.redirect("http://localhost:3001/newsfeed");
});


app.post('/info',function(req,res,next){
	var username = req.body.un;
	var pass = req.body.pw;
var options = {
    url: 'http://localhost:3002/getInfo',
    method: 'POST',
    headers: headers,
    form: {user_name: username, pass:pass}
}
// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
		console.log("I'm fucking doing it");
		console.log(JSON.parse(body));
        req.session.user = JSON.parse(body);
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({"token": "success"}));
    }
})


});

app.post('/favorites',function(req,res){
  var userdata = req.session.user;
	console.log(userdata.favorites);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({"token": "success", "favorites":userdata.favorites}));
});

app.post('/feeds',function(req,res){
	var userdata = req.session.user;
	console.log(userdata.feeds);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({"token": "success", "feeds":userdata.feeds}));
});

app.post('/feedRedirect',function(req,res){
	var feedName = req.body.feed;
	res.redirect("http://localhost:3001/newsfeed?feed="+feedName);
});


app.get('/logout',function(req,res){
	req.session.destroy();
	res.redirect("http://localhost:3001/");
});

app.post('/loggedIn',function(req,res){
  var userdata = req.session.user;
	console.log(userdata.logToken);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({"token": "success", "logToken":userdata.logToken}));
});

app.post('/user_name',function(req,res){
  var userdata = req.session.user;
	console.log(userdata.user_name);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({"token": "success", "user_name":userdata.user_name}));

});

var server = app.listen(3001, function(){
    var host = "10.239.32.182";
    var port = server.address().port;
    console.log("Server started at http://%s:%s", host, port);
});
