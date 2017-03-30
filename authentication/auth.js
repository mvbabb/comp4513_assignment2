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

{"user_name":"YWRtaW4=","name":"Michael","password":"YWRtaW4xMjMj","token":"coolAssToken","logToken":"true","level":"admin"}

*/

var request = require('request');
var express = require('express');
var bodyParse = require("body-parser");
var reader = require('fs');
var path = require('path');
var app=express();
var btoa = require('btoa');
var atob = require('atob');
var morgan = require('morgan');
//var mongodb = require('mongodb');
var mongo = require('mongodb').MongoClient;
var userDBJSON;
//app.set('port', 3001);
app.use(express.static(path.join(__dirname)));
//app.use(express.static("application"));
//app.use(express.static("images"));
//app.use('/static', express.static('public'));
app.use(bodyParse.urlencoded({extended:false}));
var assert = require('assert');
var url = "mongodb://localhost:27017/YLN";
app.use(morgan('dev'));
// "_id" : "0100",
//mongo will auto-set the _key field if I dont.
//if username and password match, save that ID on login
var exampleUser= {"user_name" : "user1", "password":"pass",
"name":"Michael", "token":"coolAssToken", "logToken":"true", "level":"admin",
"feeds" : [
  { "feed_id":"0001", "feed_name":"feed1", "sources": [ "bbc-news", "buzzfeed", "cnn"] },
  { "feed_id":"0002", "feed_name":"feed2", "sources": [ "bbc-news", "buzzfeed", "cnn"] }
],
"favorites" : [
  { "author":"testAuthor", "description":"lots of text description", "publishedAt":"2017-03-25", "title":"FakeTitle", "url":"www.google.com", "urlToImage":"www.google.com/news"},
  { "author":"testAuthor2", "description":"lots of text description2", "publishedAt":"2017-03-22", "title":"FakeTitle2", "url":"www.google.com", "urlToImage":"www.google.com"}] };




app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//mongo DB test secion

mongo.connect(url, function(err, db) {
  if(!err) {
    console.log("We are connected");

    db.createCollection('users', function(err, collection) {});
    var collection = db.collection('users');
    var lotsOfDocs = [{'hello':'doc3', 'key':'4'}, {'hello':'doc4', 'key':'5'}];
    //collection.insert(exampleUser);
    //collection.insert(doc2, {w:1}, function(err, result) {});
    //find().each will grab the whole thing
    //find().next will grab one at a time
    var json = reader.readFileSync("user_info.json");

//-------------USE TO CLEAR and populate WHOLE DB FOR FRESH RUN-----------------
    db.collection('users').deleteMany();

//populate with 2 basic users
    var jsonContent = JSON.parse(json);
    for(x in jsonContent){
    db.collection('users').insertOne(jsonContent[x], function(err, result) {
      assert.equal(null, err);
    console.log('Item inserted');
  })};
  //-----------------------------------------------------------------


    collection.find().each(function(err, doc) {
      console.log(doc);

    });
    //console.log(testResults);
    db.close();
  }
});

//end mongo test section

//mongDB request options
app.post('/get-all-data', function(req, res){
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('users').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      console.log(resultArray);
      res.send(resultArray);
    });
  });
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
    console.log("BtoA test: "+text);

    var json = reader.readFileSync("user_info.json");
    var jsonContent = JSON.parse(json);
    for(x in jsonContent){
      //console.log("Json Content[x]-> "+JSON.stringify(jsonContent[x]));

    };

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
			  //-----------------------------------------------------------------


			  //---------------------------------------------------------------------
                     res.redirect("http://localhost:3001/sources");
              }

          else{

              res.redirect("http://localhost:3001");

            }
              }

        };
    if(authResponse == "false"){

              res.redirect("http://localhost:3001");

            };

    });

app.post('/authentication_server', function(req,res){
    console.log("secure server accesed");
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
            }else{
              res.redirect("http://localhost:3002/");
            }
              }
        };

    });

app.post('/getInfo',function(req,res,next){
	//Andrew:
	console.log("inside getInfo: "+req.body.user_name + req.body.pass);
	//should return specific user based on username and password (these work and have been test )
  var user2find = btoa(req.body.user_name);
  var pass2find = btoa(req.body.pass);
  getOneUserData(user2find, pass2find, function(err, result){
    var session = result;
    res.setHeader('Content-Type', 'application/json');
    res.send(exampleUser);
  });//end getOneUserData callback

});


function getOneUserData(user, pw, callback){
  var resultArray = [];
  var stringResp = "";
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('users').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      //console.log("indiv doc test: "+JSON.stringify(doc));
      resultArray.push(doc);

    }, function() {
      db.close();
      stringResp = JSON.stringify(resultArray);
      newJSON= JSON.parse('{"users":'+stringResp+'}'); //had to add this to avoid parsing issues
      //console.log("single array entry test : "+resultArray);
      var found = false;
      var toReturn = "";
      for(x in newJSON.users){
        if(newJSON.users[x].user_name == user && newJSON.users[x].password == pw){
            console.log("user info found in getOneUserData");
            toReturn = JSON.stringify(newJSON.users[x]);
            found == true;
        }
      }
      callback(null, toReturn);
    }
  );
  });
}

function getAllUserData(callback){
  var resultArray = [];
  var stringResp = "";
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('users').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      //console.log("indiv doc test: "+JSON.stringify(doc));
      resultArray.push(doc);

    }, function() {
      db.close();
      stringResp = JSON.stringify(resultArray);
      newJSON= '{"users":'+stringResp+'}'; //had to add this to avoid parsing issues
      //console.log("single array entry test : "+resultArray);
      callback(null, newJSON);
    }
  );
  });
}



app.post('/new_user', function(req,res){
    console.log("entering new_user on secure server");
    var json = reader.readFileSync("user_info.json");
    var jsonContent = JSON.parse(json);
var cont="true";

    getAllUserData(function(err, result){
      //console.log("in new_user:: "+result);

    var JSONresult = JSON.parse(result);
    var user_name_node=btoa(req.body.uname);
    var password_node=btoa(req.body.psw);
    var actual_name = req.body.actualname;
    //console.log("JSON test: "+JSONresult.users[0].user_name);
      for(x in JSONresult.users){
        //console.log("loop test: "+JSONresult.users[x].user_name);
        if(JSONresult.users[x].user_name == user_name_node){
          cont="false";
          console.log("username already exists, cancelling new user");
        }
      }
      if(cont == "true"){
        console.log("new username confirmed");
      //var totalUsers = Object.keys(jsonContent).length + 1;
      jsonContent = JSON.stringify(jsonContent);
      var user_name_node=btoa(req.body.uname);
      var password_node=btoa(req.body.psw);
      var actual_name = req.body.actualname;
      //WRITING TO FILE STOPPED HERE------------------------
      //reader.writeFileSync("user_info.json",jsonContent);

      var NewMongoUser= '{"user_name" : "'+user_name_node+'", "password":"'+password_node+'", "name":"'+
      actual_name+'", "token":"coolAssToken", "logToken":"false", "level":"regular", "feeds" : [], "favorites" : [] }';
      var newUserJSON = JSON.parse(NewMongoUser); //needs to be JSON
      mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('users').insertOne(newUserJSON, function(err, result) {
          assert.equal(null, err);
          console.log('New User inserted');
          db.close();
        });
      });

      //CAN CHANGE TO RESPONDING WITH SUCCESS/FAIL MESSAGES
      console.log("new mongo user: "+NewMongoUser);
      res.redirect("http://localhost:3001/");

    }else{res.redirect("http://localhost:3001/")}



    }); //end of getAllUserData callback


    /*for(x in jsonContent){
        console.log(jsonContent[x].user_name + ", "+req.body.uname);
        if(jsonContent[x].user_name == req.body.uname){
        cont = "false";}
    }*/

});




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
