var Live = (function(Analyser, Drawer) {  

  //expose a global socket for client (this app)
  var socket = io();
  var data = {"sound" : "555,5555,6,66,,6,76776"};
  var peer = new Peer('live', {host: '192.168.1.105', port: 4001, path: '/stream'});

  socket.emit('live-connect', data);
  peer.on('connection', function(conn) {
    conn.on('data', function(data){
      // Will print 'hi!'
      console.log(data);
    });
  });

  var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  peer.on('call', function(call) {
    getUserMedia({video: false, audio: true}, function(stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      call.on('stream', function(remoteStream) {
        // Show stream in some video/canvas element.
      });
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });
  });


  
  document.getElementById("output").innerHTML = "test";
  
  socket.on('changeBkgColor', function(data){
    document.body.style.background = 'green';
  });

  var clickRedBtn = function(){
    socket.emit('clicked-red-button-live', data);
  }


  var stopDrawings = function(){
    Drawer.stopDrawings();
  }

  socket.on('audio-received', function(data){
    console.log("Audio received!", data);
    
  });

  var draw = function(analyserNode){
    Drawer.drawFrequenciesCanvas(analyserNode, "analyserHTMLcanvas");
  }  


  //expose public vars and/or function
  return {
    socket            : socket,
    clickRedBtn       : clickRedBtn,
    stopDrawings      : stopDrawings
  };


})(Analyser, Drawer);