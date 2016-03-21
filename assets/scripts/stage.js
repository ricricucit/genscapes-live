var Stage = (function(Analyser, Drawer) {  

  //expose a global socket for client (this app)
  var socket = io();
  var data = {"sound" : "555,5555,6,66,,6,76776"};
  var peer = new Peer('stage', {host: '192.168.1.200', port: 4002, path: '/rt'});
  
  var audioContext    = new AudioContext();
  var realAudioInput  = null,
      analyserNode    = null;

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
    var streamPromise = Analyser.captureAudio(processAudio);

    //console.log(streamPromise);
    //socket.emit('audio-sent', audioStream);

    streamPromise.then(function(audioStream){

      // The Following structure creates this graph:
      // realAudioInput --> analyserNode --> audioProcessor
      realAudioInput  = audioContext.createMediaStreamSource(audioStream);
      analyserNode = audioContext.createAnalyser();
      realAudioInput.connect(analyserNode);
      analyserNode.fftSize = 2048;

      draw(analyserNode);
      //Drawer.drawFrequenciesCanvas(audioStream, "analyserHTMLcanvas");

      //send analyserNode to live, from here
      var call = peer.call('live', audioStream);
      console.log('streamin',audioStream);
     
    });
  }

  var draw = function(analyserNode){

    var analyserCanvas = document.getElementById("analyserHTMLcanvasStage");

    var canvas =  {
                    "el"      : analyserCanvas,
                    "context" : analyserCanvas.getContext('2d'),
                    "width"   : analyserCanvas.width,
                    "height"  : analyserCanvas.height
                  };
    Drawer.drawFrequenciesCanvas(analyserNode, canvas);
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


})(Analyser, Drawer);