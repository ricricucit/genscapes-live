//get express (http://expressjs.com/)
var express = require('express');             // Get the module

var app = express();                          // Create express by calling the prototype in var express
var app_stage = express();

var path = require('path');                   // Require path tool
//create http server
var http = require('http').Server(app);
var http_stage = require('http').Server(app_stage);
//create socket from socket.io and pass the http server to it
var io = require('socket.io')(http);
var io_linein = require('socket.io')(http_stage);
// middleware to isolate some funcs
var middleware = require("./middleware.js");

//global socket creation (initialised on specific routes)
var socket = {};

//start express
http.listen(3000, "192.168.1.105" ,function(){
  console.log('listening on 192.168.1.105:3000');
});
//start express
http_stage.listen(4000, "192.168.1.200" ,function(){
  console.log('listening on 192.168.1.200:4000');
});

//define static assets folder as "/assets"
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app_stage.use(express.static(path.join(__dirname, 'assets')));
app_stage.use(express.static(path.join(__dirname, 'bower_components')));

//ROUTES
app.get('/', function(req, res){
  res.sendFile(__dirname + '/templates/live.html');
});

app_stage.get('/stage', function(req, res){
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
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!SHIEEEEEET: stage is not there!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    }

  });

  
  //client connection
  socket.on('client-connect', function(data){
    middleware.addClient(socket.client.id, "client", data);
  });

  //test event
  socket.on('clicked-red-button', function(data){
    console.log('----------------------------------------------- CLICKED RED BUTTON!');
  });


});

//on connection creation, a socket is created
io_linein.on('connection', function(socket){

  //console.log('1 user connected, ID: ', socket.client.id);

  //middleware.getLiveObj();

  socket.on('disconnect', function(){
    console.log('linein, #' + socket.client.id + ' disconnected');

    middleware.removeClient(socket.client.id);

    if(!middleware.stageIsConnected()){
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!SHIEEEEEET: linein is not there!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    }

  });

  //linein connection
  socket.on('stage-connect', function(data){
    middleware.addClient(socket.client.id, "stage", data);
  });

  //test event
  socket.on('clicked-red-button-stage', function(data){
    console.log('----------------------------------------------- CLICKED RED BUTTON FROM Stage!!');
  });

});