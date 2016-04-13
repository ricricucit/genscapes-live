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


// create needed servers
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
                                          }, app_live);

//create socket from socket.io and pass the http server to it
var io_live = require('socket.io')(https_live);
var io_stage = require('socket.io')(https_stage);
// middleware to isolate some funcs
var middleware = require("./middleware.js");


//global socket creation (initialised on specific routes)
var socket = {};



//start express LIVE
https_live.listen(config.live_port, config.live_address ,function(){
  console.log('LIVE listening events on https://'+config.live_address+':'+config.live_port);
}).on('error', function(err) {
  console.log('\n------------------------------------\nNetworking ERROR.\nCannot listen to: ' + config.live_address + ':' + config.live_port + '\nPlease check your Network settings\n------------------------------------\n');
  process.exit();
});
//start express LIVE (for streaming)
https_stream_stage.listen(3002, config.live_address ,function(){
  console.log('LIVE listening STREAM events '+config.live_address+':3002');
}).on('error', function(err) {
  console.log('\n------------------------------------\nNetworking ERROR.\nCannot listen to: ' + config.live_address + ':3002\nPlease check your Network settings\n------------------------------------\n');
  process.exit();
});
//start express STAGE
https_stage.listen(config.stage_port, config.stage_address ,function(){
  console.log('listening STREAM on https://'+config.stage_address+':'+config.stage_port);
}).on('error', function(err) {
  console.log('\n------------------------------------\nNetworking ERROR.\nCannot listen to: ' + config.stage_address + ':' + config.stage_port + '\nPlease check your Network settings\n------------------------------------\n');
  process.exit();
})

//define static assets folder as "/assets"
app_live.use(express.static(path.join(__dirname, 'assets')));
app_live.use(express.static(path.join(__dirname, 'bower_components')));
app_live.use(express.static(path.join(__dirname, 'node_modules')));

app_stage.use(express.static(path.join(__dirname, 'assets')));
app_stage.use(express.static(path.join(__dirname, 'bower_components')));
app_stage.use(express.static(path.join(__dirname, 'node_modules')));


//ROUTES

//endpoint for cloud server
app_live.get('/message', function(req, res){
  io_live.sockets.emit('changeBkgColor', '#556644');
  res.send('OK');
});
//endpoint for streaming
app_live.use('/rt',  ExpressPeerServer(https_stream_stage, {debug: 3}));


//serve live JS App (getting stream from everybody + drawing)
app_live.get('/', function(req, res){
  res.sendFile(__dirname + '/templates/live.html');
});

//serve stage JS App (getting linein and streaming to live)
app_stage.get('/', function(req, res){
  res.sendFile(__dirname + '/templates/stage.html');
});

//on connection creation, a socket is created
io_live.on('connection', function(socket){

  console.log('\n✆ Live/Projection connected, ID: ', socket.client.id);

  //middleware.getLiveObj();

  socket.on('disconnect', function(){

    console.log('user, #' + socket.client.id + ' disconnected');

    middleware.removeClient(socket.client.id);

    if(!middleware.stageIsConnected()){
      console.error('\n☹ STAGE is not present.')
    }
  });


  //live connection
  socket.on('live-connect', function(data){
    middleware.addClient(socket.client.id, "live", data);
  });

  //live connection
  socket.on('cloud-connect', function(data){
    middleware.addClient(socket.client.id, "cloud", data);
    var liveObj = middleware.getLiveObj()
    socket.broadcast.emit("user-joined", liveObj);
  });

  //test event
  socket.on('clicked-red-button', function(data){
    console.log('----------------------------------------------- CLICKED RED BUTTON from live!');
  });

});

//on connection creation, a socket is created
io_stage.on('connection', function(socket){

  console.log('\n♪ Stage Device (linein provider) connected, socket.client.id: ', socket.client.id);

  //middleware.getLiveObj();

  socket.on('disconnect', function(){
    console.log('linein, #' + socket.client.id + ' disconnected');

    middleware.removeClient(socket.client.id);

    if(!middleware.stageIsConnected()){
      console.error('\n☹ STAGE is not present.')
    }

  });

  //stage/linein connection
  socket.on('stage-connect', function(data){
    middleware.addClient(socket.client.id, "stage", data);
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