/*

    -Same application token for everyone
    -if the app has the matching token for the authentication server then it verifies
    -if the app is valid(same as above) then verify the user for access
    -everyone is  an "admin level"
    -submit through the google drive (mbabb668), send a share link to Padma
    


*/



var express = require('express');
var bodyParse = require("body-parser");
var reader = require('fs');
var path = require('path');
var app=express();
//app.set('port', 3001);
app.use(express.static(path.join(__dirname)));
//app.use(express.static("application"));
//app.use(express.static("images"));
//app.use('/static', express.static('public'));
app.use(bodyParse.urlencoded({extended:false}));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.get('/', function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.get('/readfile', function(req,res){
    var data = reader.readFileSync('index.html');
    res.send(data);
});

app.get("/error", function(req,res) {
        res.sendFile(__dirname + "/error.html");
        });

app.get("/secure", function(req,res) {
    
    
    
        res.sendFile(__dirname + "/secure.html");
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
    /*var user_name_node="admin"req.body.un;
    var password_node=req.body.pw;
    console.log("Username:" + user_name_node + " Password:" + password_node);
    var authResponse={
        
        "token":"false"
    }
    
    if(user_name_node == "admin"){
        
        authResponse={
            "token":"true"
        }
    }
    console.log(authResponse.token);
    if(authResponse.token == "false"){
        
    res.sendFile(__dirname + "/error.html");
}
    else{
        res.sendFile(__dirname + "/secure.html");
    }});*/
var server = app.listen(3001, function(){
    var host = "10.239.32.182";
    var port = server.address().port;
    console.log("Server started at http://%s:%s", host, port);
});