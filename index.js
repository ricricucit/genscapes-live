var config = require("./config.json");

//get express (http://expressjs.com/)
var express = require('express');             // Get the module

//include Peer server (for streaming data... see peerjs-server "Combinined with Express App")
var ExpressPeerServer = require('peer').ExpressPeerServer;

var app_live  = express();                    // Create express apps
var app_stage = express();

// Require path tool
var path = require('path');

// Require file module
const fs = require('fs');

// set HTTPS certs
var privateKey = fs.readFileSync( config.ssl_private_key );
var certificate = fs.readFileSync( config.ssl_certificate );



var peer_options = {
    debug: true
}

// var peer_server = PeerServer({
//                               port: 4001,
//                               ssl: {
//                                 key: privateKey,
//                                 cert: certificate
//                               }
//                             });


var https_live = require('https').createServer( {
                                              key: privateKey,
                                              cert: certificate
                                          }, app_live);
var https_stage = require('https').createServer( {
                                              key: privateKey,
                                              cert: certificate
                                          }, app_stage);

var https_stream_stage = require('https').createServer( {
                                              key: privateKey,
                                              cert: certificate
                                          }, app_stage);

//create socket from socket.io and pass the http server to it
var io_live = require('socket.io')(https_live);
var io_stage = require('socket.io')(https_stage);
// middleware to isolate some funcs
var middleware = require("./middleware.js");


//global socket creation (initialised on specific routes)
var socket = {};



//start express
https_live.listen(config.live_port, config.live_address ,function(){
  console.log('listening live on https://'+config.live_address+':'+config.live_port);
});
//start express
https_stage.listen(config.stage_port, config.stage_address ,function(){
  console.log('listening stage on https://'+config.stage_address+':'+config.stage_port);
});

//start express
https_stream_stage.listen(4002, config.stage_address ,function(){
  console.log('listening stage on '+config.stage_address+':4002');
});

//define static assets folder as "/assets"
app_live.use(express.static(path.join(__dirname, 'assets')));
app_live.use(express.static(path.join(__dirname, 'bower_components')));
app_live.use(express.static(path.join(__dirname, 'node_modules')));

app_stage.use(express.static(path.join(__dirname, 'assets')));
app_stage.use(express.static(path.join(__dirname, 'bower_components')));
app_stage.use(express.static(path.join(__dirname, 'node_modules')));


app_stage.use('/rt',  ExpressPeerServer(https_stream_stage, {debug: 3}));


//ROUTES
app_live.get('/', function(req, res){
  res.sendFile(__dirname + '/templates/live.html');
});

app_stage.get('/', function(req, res){
  res.sendFile(__dirname + '/templates/stage.html');
});

//on connection creation, a socket is created
io_live.on('connection', function(socket){

  console.log('1 Live user connected, ID: ', socket.client.id);

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
    console.log('----------------------------------------------- CLICKED RED BUTTON from live!');
  });

});

//on connection creation, a socket is created
io_stage.on('connection', function(socket){

  console.log('1 Stage user connected, ID: ', socket.client.id);

  //middleware.getLiveObj();

  socket.on('disconnect', function(){
    console.log('linein, #' + socket.client.id + ' disconnected');

    middleware.removeClient(socket.client.id);

    if(!middleware.stageIsConnected()){
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!SHIEEEEEET: Stage is not there!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    }

  });

  //linein connection
  socket.on('stage-connect', function(data){
    middleware.addClient(socket.client.id, "stage", data);
  });

  socket.on('audio-sent', function(streamData){
    console.log('--------------------- audio received from io_stage!', streamData);
    io_live.sockets.emit('audio-received', streamData);
  });


  socket.on('clicked-red-button-stage', function(data){
    console.log('----------------------------------------------- CLICKED RED BUTTON from Stage!');
    io_live.sockets.emit('changeBkgColor', data);
    io_stage.sockets.emit('changeBkgColor', data);
  });

  socket.on('stop-drawings', function(data){
    console.log('----------------------------------------------- Stop Drawings from Stage!');
    io_live.sockets.emit('stop-drawings', data);
    
  });

  socket.on('change-color', function(data){
    console.log('----------------------------------------------- Change Color!');
    io_live.sockets.emit('change-color', data);
    
  });





});