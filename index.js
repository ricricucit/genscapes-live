//get express (http://expressjs.com/)
var express = require('express');             // Get the module
var app = express();                          // Create express by calling the prototype in var express
var path = require('path');                   // Require path tool
//create http server
var http = require('http').Server(app);
//create socket from socket.io and pass the http server to it
var io = require('socket.io')(http);
// middleware to isolate some funcs
var middleware = require("./middleware.js");

//global socket creation (initialised on specific routes)
var socket = {};

//start express
http.listen(3000, function(){
  console.log('listening on *:3000');
});

//define static assets folder as "/assets"
app.use(express.static(path.join(__dirname, 'assets')));

//ROUTES
app.get('/', function(req, res){
  res.sendFile(__dirname + '/templates/index.html');
});

app.get('/stage', function(req, res){
  res.sendFile(__dirname + '/templates/stage.html');
});


//on connection creation, a socket is created
io.on('connection', function(socket){

  //console.log('1 user connected, ID: ', socket.client.id);
  
  //middleware.getLiveObj();
  
  socket.on('disconnect', function(){

    console.log('user, #' + socket.client.id + ' disconnected');

    middleware.removeClient(socket.client.id);

    if(!middleware.stageIsConnected()){
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!SHIEEEEEET: stage is not there!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    }

  });

  //client connection
  socket.on('stage-connect', function(data){
    middleware.addClient(socket.client.id, "stage", data);
  });

  //stage connection
  socket.on('client-connect', function(data){
    middleware.addClient(socket.client.id, "client", data);
  });

  //test event
  socket.on('clicked-red-button', function(data){
    console.log('----------------------------------------------- CLICKED RED BUTTON!');
  });

  //test event
  socket.on('clicked-red-button-stage', function(data){
    console.log('----------------------------------------------- CLICKED RED BUTTON FROM STAGE!!');
  });
  
  
});