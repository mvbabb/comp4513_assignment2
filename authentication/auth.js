/*

    -Same application token for everyone
    -if the app has the matching token for the authentication server then it verifies
    -if the app is valid(same as above) then verify the user for access
    -everyone is  an "admin level"
    -submit through the google drive (mbabb668), send a share link to Padma

-username: normal
-password: normal123

-adminUsername: admin
-adminPassword: admin123#
*/



var express = require('express');
var bodyParse = require("body-parser");
var reader = require('fs');
var path = require('path');
var app=express();
var btoa = require('btoa');
var atob = require('atob');
//var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
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

MongoClient.connect("mongodb://localhost:27017/YLN", function(err, db) {
  if(!err) {
    console.log("We are connected");

    db.createCollection('users', function(err, collection) {});
    var collection = db.collection('users');
    var doc1 = {'hello':'doc1', 'key':'1'};
    var doc2 = {'hello':'doc2', 'key':'2'};
    var lotsOfDocs = [{'hello':'doc3', 'key':'4'}, {'hello':'doc4', 'key':'5'}];
    console.log("before the inserts!");
    collection.insert(doc1);
    collection.insert(doc2, {w:1}, function(err, result) {});
    //collection.insert(lotsOfDocs, {w:1}, function(err, result) {});
    var testResults = collection.find().each(function(err, doc) {
      console.log(doc);
    });
    //console.log(testResults);
    db.close();
  }

});

app.get('/login', function(req,res){
    res.send("<h1 id='test' style='color:red'>hi there: I am in the root of Michael Babb</h1>");
});


app.get('/', function(req,res){
    res.sendFile(__dirname + "/yln_auth_index.html");
});

app.get('/secure', function(req,res){
    res.sendFile(__dirname + "/auth.html");
    //res.sendFile(__dirname + "/user_info.json");
});


app.get('/user_info', function(req,res){
    //res.sendFile(__dirname + "/auth.html");
    res.sendFile(__dirname + "/user_info.json");
});


app.get('/app_list', function(req,res){
    //res.sendFile(__dirname + "/auth.html");
    res.sendFile(__dirname + "/app_token.json");
});

app.post('/', function(req,res){
    console.log("secure server");
    var text = "normal123";
    text = btoa(text);
            console.log(text);

    var json = reader.readFileSync("user_info.json");
    var jsonContent = JSON.parse(json);
    var tokens = reader.readFileSync("app_token.json");
    var appContent = JSON.parse(tokens);
    var user_name_node=req.body.uname;
    var password_node=req.body.psw;
    console.log("Username:" + user_name_node + " Password:" + password_node);
    var authResponse = "false";

    for(x in jsonContent){
        jsonContent[x].logToken = "false";
    }


    for (x in jsonContent){
      if (atob(jsonContent[x].user_name) == user_name_node){
          if(password_node == atob(jsonContent[x].password)){
            authResponse = "true";
          }

          if(authResponse == "true"){
              jsonContent[x].logToken = "true";
              jsonContent = JSON.stringify(jsonContent);
              reader.writeFileSync("user_info.json",jsonContent);
                     res.redirect("http://localhost:3001/newsfeed");
              }

          else{

              res.redirect("http://localhost:3001/error");

            }
              }
        };

    });

app.post('/authentication_server', function(req,res){
    console.log("secure server");
    var json = reader.readFileSync("user_info.json");
    var jsonContent = JSON.parse(json);
    var tokens = reader.readFileSync("app_token.json");
    var appContent = JSON.parse(tokens);
    var user_name_node=req.body.uname;
    var password_node=req.body.psw;
    console.log("Username:" + user_name_node + " Password:" + password_node);
    var authResponse = "false";
        for(x in jsonContent){
        jsonContent[x].logToken = "false";
    }
    for (x in jsonContent){
      if (atob(jsonContent[x].user_name) == user_name_node){
          if(password_node == atob(jsonContent[x].password)){
            authResponse = "true";
          }

          if(authResponse == "true" && jsonContent[x].level == "admin"){
              jsonContent[x].logToken = "true";
              jsonContent = JSON.stringify(jsonContent);
              reader.writeFileSync("user_info.json",jsonContent);
                     res.redirect("http://localhost:3002/secure");
              }

          else{

              res.redirect("http://localhost:3002/");

            }
              }
        };

    });




app.post('/new_user', function(req,res){
    console.log("adding new user on secure server");
    var json = reader.readFileSync("user_info.json");
    var jsonContent = JSON.parse(json);
    var cont = "true";
    for(x in jsonContent){
        if(jsonContent[x].user_name == req.body.uname)
        cont = "false";
    }

    if(cont == true){
    var totalUsers = Object.keys(jsonContent).length + 1;
    jsonContent = JSON.stringify(jsonContent);
    var user_name_node=btoa(req.body.uname);
    var password_node=btoa(req.body.psw);
    var actual_name = req.body.actualname;
    //var tokens = reader.readFileSync("app_token.json");
    //var appContent = JSON.parse(tokens);
    var newUser = "";
    newUser =' , "user' + totalUsers +'": {"user_name":"'+ user_name_node + '","name":"' + actual_name + '","password":"' + password_node + '","token":"coolAssToken", "logToken":"false","level":"regular"}} ';

        jsonContent = jsonContent.substr(0,jsonContent.length - 1);
        jsonContent = jsonContent + newUser;
    console.log(jsonContent);
    console.log("Username:" + user_name_node + " Password:" + password_node);
    reader.writeFileSync("user_info.json",jsonContent);

    res.redirect("http://localhost:3001/secure");

  }else{res.redirect("http://localhost:3001/secure")}});




app.post('/addApp', function(req,res){
    console.log("Adding Application");
    var json = reader.readFileSync("app_token.json");
    var jsonContent = JSON.parse(json);
        var cont = "true";
    for(x in jsonContent){
        console.log(x);
        if(x == req.body.add_app_name){
        cont = "false";
        }
    }

    if(cont == "true"){


    jsonContent = JSON.stringify(jsonContent);
    var add_app_name=req.body.add_app_name;
    var add_token_name=req.body.add_token_name;
    var newApp = "";
    newApp =' ,"' + add_app_name +'": {"token":"'+ add_token_name + '"}} ';

    jsonContent = jsonContent.substr(0,jsonContent.length - 1);
    jsonContent = jsonContent + newApp;
    console.log(jsonContent);
    console.log("appName:" + add_app_name + "Token:" + add_token_name);
    reader.writeFileSync("app_token.json",jsonContent);

    res.redirect("http://localhost:3002/secure");

  }else{res.redirect("http://localhost:3002/secure");}});

app.post('/removeApp', function(req,res){
    console.log("Removing Application");
    var json = reader.readFileSync("app_token.json");
    var jsonContent = JSON.parse(json);
    //jsonContent = JSON.stringify(jsonContent);
    var appToDelete=req.body.appToModify;
    delete jsonContent[appToDelete];
    console.log(jsonContent);
    jsonContent = JSON.stringify(jsonContent);
    //console.log("Username:" + user_name_node + " Password:" + password_node);
    reader.writeFileSync("app_token.json",jsonContent);

    res.redirect("http://localhost:3002/secure");

  });

app.post('/token', function(req,res){
    console.log("Updating Tokens");
    var json = reader.readFileSync("app_token.json");
    var jsonContent = JSON.parse(json);
    var token =req.body.changeToken;
    var newToken =req.body.newToken;
    jsonContent[token] = newToken;
    jsonContent = JSON.stringify(jsonContent);
    reader.writeFileSync("app_token.json",jsonContent);
    res.redirect("http://localhost:3002/secure");

  });




app.post('/add_admin', function(req,res){
    console.log("Adding User");
    var json = reader.readFileSync("user_info.json");
    var jsonContent = JSON.parse(json);
    var cont = "true";
    for(x in jsonContent){
        console.log(x);
        if(jsonContent[x].user_name == req.body.addAdmin){
        cont = "false";
        }
    }

    if(cont == "true"){

    var totalUsers = Object.keys(jsonContent).length + 1;
    jsonContent = JSON.stringify(jsonContent);
    var user_name_node=btoa(req.body.addAdmin);
    var password_node=btoa(req.body.addAdminPassword);
    var actual_name = req.body.actualAdminName;
    var level = req.body.level;
    var token = req.body.appToAddUser;

    var apps = reader.readFileSync("app_token.json");
    var appContent = JSON.parse(apps);

    var usersToken = appContent[token];
        console.log(usersToken.token);
    var newUser = "";
    newUser =' , "user' + totalUsers +'": {"user_name":"'+ user_name_node + '","name":"' + actual_name + '","password":"' + password_node + '","token":"' + usersToken.token + '", "logToken":"false","level":"' + level + '"}} ';

        jsonContent = jsonContent.substr(0,jsonContent.length - 1);
        jsonContent = jsonContent + newUser;
    console.log(jsonContent);
    console.log("Username:" + user_name_node + " Password:" + password_node);
    reader.writeFileSync("user_info.json",jsonContent);

    res.redirect("http://localhost:3002/secure");

  }else{res.redirect("http://localhost:3002/secure");}});



app.post('/remove_admin', function(req,res){
    console.log("Removing User");
    var json = reader.readFileSync("user_info.json");
    var jsonContent = JSON.parse(json);
    //jsonContent = JSON.stringify(jsonContent);
    var userToDelete = req.body.userToRemove;
    delete jsonContent[userToDelete];
    console.log(jsonContent);
    jsonContent = JSON.stringify(jsonContent);
    //console.log("Username:" + user_name_node + " Password:" + password_node);
    reader.writeFileSync("user_info.json",jsonContent);

    res.redirect("http://localhost:3002/secure");

  });

app.post('/modify_admin', function(req,res){
    console.log("Modifying User");
    var json = reader.readFileSync("user_info.json");
    var jsonContent = JSON.parse(json);
    //jsonContent = JSON.stringify(jsonContent);
    var userToModify = req.body.userToModify;
    var userName = btoa(req.body.newUserName);
    jsonContent[userToModify].user_name = user;
    console.log(jsonContent);
    jsonContent = JSON.stringify(jsonContent);
    //console.log("Username:" + user_name_node + " Password:" + password_node);
    reader.writeFileSync("user_info.json",jsonContent);

    res.redirect("http://localhost:3002/secure");

  });

var server = app.listen(3002, function(){
    var host = "10.239.32.182";
    var port = server.address().port;
    console.log("Server started at http://%s:%s", host, port);
}
);
