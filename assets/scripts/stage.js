var Stage = (function(Analyser, Drawer) {  

  //expose a global socket for client (this app)
  var socket = io();
  var data = {"sound" : "555,5555,6,66,,6,76776"};

  socket.emit('stage-connect', data);

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
    var audioPromise = Analyser.captureAudio(processAudio);

    //console.log(audioPromise);

    audioPromise.then(function(analyserNode){
      //console.log("analyserNode!", analyserNode);
      // globalAnalyserNode = analyserNode;
      //requestAnimationFrame
      console.log(Drawer);
      Drawer.drawFrequenciesCanvas(analyserNode, "analyserHTMLcanvas");
    });
  }

  var stopAudioCapture = function(){
    Analyser.stopAudioCapture();
  }

  var stopDrawings = function(){
    Drawer.stopDrawings();
  }





  //expose public vars and/or function
  return {
    socket            : socket,
    clickRedBtn       : clickRedBtn,
    captureAudio      : captureAudio,
    stopAudioCapture  : stopAudioCapture,
    stopDrawings      : stopDrawings
  };


})(Analyser, Drawer);