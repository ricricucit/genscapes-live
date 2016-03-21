var Live = (function(Analyser, Drawer) {  

  //expose a global socket for client (this app)
  var socket = io();
  var data = {"sound" : "555,5555,6,66,,6,76776"};
  //var peer = new Peer('live', {host: '192.168.1.105', port: 4001, path: '/rt'});
  var peer = new Peer('live', {host: '192.168.1.200', port: 4002, path: '/rt'});

  var audioContext    = new AudioContext();
  var realAudioInput  = null,
      analyserNode    = null;

  socket.emit('live-connect', data);
  peer.on('connection', function(conn) {
    conn.on('data', function(data){
      // Will print 'hi!'
      console.log(data);
    });
  });


  navigator.getUserMedia = ( navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia);
  

  

  peer.on('call', function(call) {
    // Answer the call, providing our mediaStream
    call.answer();

    call.on('stream', function(remoteStream){
      // Show stream in some video/canvas element.
      console.log('Stream HERE!',remoteStream);

      // The Following structure creates this graph:
      // realAudioInput --> analyserNode --> audioProcessor
      realAudioInput  = audioContext.createMediaStreamSource(remoteStream);
      analyserNode = audioContext.createAnalyser();
      realAudioInput.connect(analyserNode);
      analyserNode.fftSize = 2048;

      draw(analyserNode);

    });

  });

  var draw = function(analyserNode){
    console.log("start drwaing!");

    var analyserCanvas = document.getElementById("analyserHTMLcanvasLive");

    var canvas =  {
                    "el"      : analyserCanvas,
                    "context" : analyserCanvas.getContext('2d'),
                    "width"   : analyserCanvas.width,
                    "height"  : analyserCanvas.height
                  };
                  console.log(canvas);

    Drawer.drawFrequenciesCanvas(analyserNode, canvas);
  }
  
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



  //expose public vars and/or function
  return {
    socket            : socket,
    clickRedBtn       : clickRedBtn,
    stopDrawings      : stopDrawings
  };


})(Analyser, Drawer);