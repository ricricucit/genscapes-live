var Stage = (function() {  

  //expose a global socket for client (this app)
  var socket = io();
  var data = {"sound" : "555,5555,6,66,,6,76776"};

  var html_out = document.getElementById("output");
  
  var audioContext = new AudioContext();
  var realAudioInput = null,
      gainNode = null,
      delayNode = null,
      analyserNode = null;
  var rafID = null;
  var analyserCanvasContext = null;
  var canvasWidth, canvasHeight;
  var audioStream;

  socket.emit('stage-connect', data);

  socket.on('changeBkgColor', function(data){
    document.body.style.background = 'green';
  });

  var clickRedBtn = function(){
    socket.emit('clicked-red-button-stage', data);
  }

  var captureAudio = function(){

    navigator.getUserMedia = ( navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia ||
                               navigator.msGetUserMedia);

    navigator.getUserMedia({
        audio: true,
        video: false
    }, function(stream) {
        
        audioStream = stream;


        // The Following structure creates this graph:
        // realAudioInput --> gainNode --> delayNode -> analyserNode


        // Create an AudioNode from realAudio (stream) (https://developer.mozilla.org/en-US/docs/Web/API/AudioNode)
        realAudioInput  = audioContext.createMediaStreamSource(stream);        
        
        // Create a new AudioNode "gainNode" that can be used to regulate the overall Gain (or audio level)
        gainNode  = audioContext.createGain();
        
        //connect one output (real audio) node to the input of another node (inputPoint).
        realAudioInput.connect(gainNode);


        // !!! @enrico's test: attach a delay, before the analyser
        // delayNode = audioContext.createDelay();
        // delayNode.delayTime.value = 100;
        //connect delay after gainNode...which is after after realAudioInput
        // gainNode.connect( delayNode );


        //create a new AudioNode (analyser) which can be used to expose
        //audio time and frequency to create data visualisations.
        analyserNode = audioContext.createAnalyser();
        //Fast Fourier Transform Size 
        analyserNode.fftSize = 128;

        //connect gainNode to the Analyser Node (to read data)
        gainNode.connect( analyserNode );

        // !!! use only if delay node is there:
        //delayNode.connect( analyserNode );

        // !!! use only if delay node is there:
        //connect gainNode to the Analyser Node (to read data)
        //delayNode.connect( audioContext.destination );




       
        //start drawing "inside requestAnimationFrame"
        updateAnalysers();


    }, function(error) {
        //no UserMedia
        if(error){
          alert(JSON.stringify(error));
        }else{
          alert("no UserMedia");
        }
    });

  }

  var stopAudioCapture = function(){
    console.log(audioStream);
    audioStream.getTracks()[0].stop();
    window.cancelAnimationFrame(rafID);
  }


  var start       = null;
  var progressBef = 0;
  function updateAnalysers(timestamp) {

    if (!start) start = timestamp;
    progress = Math.floor((timestamp - start)/1000);

    if(progress !== progressBef){
      progressBef = progress;
      console.log("time:", progress);
    }else{
      //console.log("frames per second");
    }

    
    // get HTML canvas from DOM and create its context
    if (!analyserCanvasContext) {
        var analyserCanvas    = document.getElementById("analyserHTMLcanvas");

        canvasWidth           = analyserCanvas.width;
        canvasHeight          = analyserCanvas.height;
        analyserCanvasContext = analyserCanvas.getContext('2d');
    }

    // analyzer draw code here
    var SPACING = 3;
    var BAR_WIDTH = 2;
    var numBars = Math.round(canvasWidth / SPACING);
    var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

    analyserNode.getByteFrequencyData(freqByteData); 

    analyserCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    analyserCanvasContext.fillStyle = '#F6D565';
    analyserCanvasContext.lineCap = 'round';
    var multiplier = analyserNode.frequencyBinCount / numBars;

    // Draw rectangle for each frequency bin.
    for (var i = 0; i < numBars; ++i) {
        var magnitude = 0;
        var offset = Math.floor( i * multiplier );
        // gotta sum/average the block, or we miss narrow-bandwidth spikes
        for (var j = 0; j< multiplier; j++)
            magnitude += freqByteData[offset + j];
        magnitude = magnitude / multiplier;
        var magnitude2 = freqByteData[i * multiplier];
        analyserCanvasContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
        analyserCanvasContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
    }
    
    rafID = window.requestAnimationFrame( updateAnalysers ); //returns a unique ID
}

  
  //expose public vars and/or function
  return {
    socket            : socket,
    clickRedBtn       : clickRedBtn,
    captureAudio      : captureAudio,
    stopAudioCapture  : stopAudioCapture
  };


})();