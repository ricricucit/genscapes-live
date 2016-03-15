var Live = (function(){

  //expose a global socket for client (this app)
  var socket = io();
  var data = {"color" : '#'+Math.floor(Math.random()*16777215).toString(16)};
  
  var audioContext1 = new AudioContext();
  var audioInput = null,
      realAudioInput = null,
      inputPoint = null,
      audioRecorder = null;
  var rafID = null;
  var analyserContext = null;
  var canvasWidth, canvasHeight;
  var recIndex = 0;
  var source = audioContext1.createBufferSource();

  socket.emit('client-connect', data);
  
  socket.on('changeBkgColor', function(data){
    document.body.style.background = 'blue';
  });

  var clickRedBtn = function(){
    socket.emit('clicked-red-button', data);
  }

  socket.on('change-canvas', function(data){
    console.log(data);

    inputPoint = audioContext1.createGain();

        // Create an AudioNode from the stream.
    
   // set the buffer in the AudioBufferSourceNode
    //source.buffer = data;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(audioContext1.destination);

    

    //    audioInput = convertToMono( input );

    analyserNode = audioContext1.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect( analyserNode );

   // audioRecorder = new Recorder( inputPoint );

    zeroGain = audioContext1.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( audioContext1.destination );
    updateAnalysers();

  });

  function updateAnalysers(time) {
    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        analyserContext = canvas.getContext('2d');
    }

    // analyzer draw code here
    {
        var SPACING = 100;
        var BAR_WIDTH = 2;
        var numBars = Math.round(canvasWidth / SPACING);
        var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

        analyserNode.getByteFrequencyData(freqByteData); 

        analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
        analyserContext.fillStyle = '#F6D565';
        analyserContext.lineCap = 'round';
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
            analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
            analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
        }
    }
    
    rafID = window.requestAnimationFrame( updateAnalysers );
  }

  //expose public vars and/or function
  return {
    socket        : socket,
    clickRedBtn   : clickRedBtn
  };

})();