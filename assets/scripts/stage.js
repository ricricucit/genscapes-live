var Stage = (function(Analyser) {  

  //expose a global socket for client (this app)
  var socket = io();
  var data = {"sound" : "555,5555,6,66,,6,76776"};
  var peer = new Peer('stage', {host: '192.168.1.200', port: 4002, path: '/stream'});
  
  //connect to live, send a simple message
  var conn = peer.connect('live');
  conn.on('open', function(){
    conn.send('hi!');
  });


  socket.emit('stage-connect', data);
  
  document.getElementById("output").innerHTML = "test";
  
  socket.on('changeBkgColor', function(data){
    document.body.style.background = 'green';
  });

  var clickRedBtn = function(){
    socket.emit('clicked-red-button-stage', data);
  }

  var processAudio = function(evt){
    //PROCESS AUDIO HERE!
    //console.log(evt);
  }
  

  var globalAnalyserNode;
  var captureAudio = function(){
    var audioStream = Analyser.captureAudio(processAudio);

    //call
    var call = peer.call('live', audioStream);
    call.on('stream', function(remoteStream) {
      // Show stream in some video/canvas element.
      console.log('streamin');
    });


    //console.log(audioPromise);

    socket.emit('audio-sent', audioStream);
    /*audioPromise.then(function(analyserNode){
      //send analyserNode to live, from here
      
      console.log("node emitted!");
    });*/
  }

  var stopAudioCapture = function(){
    Analyser.stopAudioCapture();
  }





  //expose public vars and/or function
  return {
    socket            : socket,
    clickRedBtn       : clickRedBtn,
    captureAudio      : captureAudio,
    stopAudioCapture  : stopAudioCapture
  };


})(Analyser);