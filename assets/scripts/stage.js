var Stage = (function() {  

  //expose a global socket for client (this app)
  var socket = io();
  var data = {"sound" : "555,5555,6,66,,6,76776"};

  var html_out = document.getElementById("output");
  
  var audioContext1 = new AudioContext();
  var audioInput = null,
      realAudioInput = null,
      inputPoint = null,
      audioRecorder = null;
  var rafID = null;
  var analyserContext = null;
  var canvasWidth, canvasHeight;
  var recIndex = 0;

  socket.emit('stage-connect', data);

  socket.on('changeBkgColor', function(data){
    document.body.style.background = 'green';
  });

  var clickRedBtn = function(){
    socket.emit('clicked-red-button-stage', data);
  }

  var captureAudio = function(){

    //alert('capture!');
    var recordAudio;

    navigator.getUserMedia({
        audio: true,
        video: false
    }, function(stream) {
        
        console.log("stream: ",stream);
        recordAudio = RecordRTC(stream, {
            bufferSize: 2048
        });

        var audioContext = window.AudioContext;
        var context = new audioContext();
        var audioInput = context.createMediaStreamSource(stream);
        var bufferSize = 2048;
        // create a javascript node
        var recorder = context.createScriptProcessor(bufferSize, 1, 1);
        // specify the processing function
        recorder.onaudioprocess = recorderProcess;
        // connect stream to our recorder
        audioInput.connect(recorder);
        // connect our recorder to the previous destination
        recorder.connect(context.destination);

        //recordAudio.startRecording();


        // start of canvas code <<<---------- 

        inputPoint = audioContext1.createGain();

        // Create an AudioNode from the stream.
        realAudioInput = audioContext1.createMediaStreamSource(stream);
        audioInput = realAudioInput;
        audioInput.connect(inputPoint);

        var audioInput2 = audioContext1.createMediaStreamSource(stream);
        var bufferSize = 2048;
        var recorder = audioContext1.createScriptProcessor(bufferSize, 1, 1);
        recorder.onaudioprocess = recorderProcess;
        audioInput2.connect(recorder);

        

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

        // end of canvas code <<<---------- 


    }, function(error) {
        //no UserMedia
        if(error){
          alert(JSON.stringify(error));
        }else{
          alert("no UserMedia");
        }
    });

  }

  var recorderProcess = function(e) {
    var left = e.inputBuffer.getChannelData(0);
    console.log(left);
  }

  function updateAnalysers(time) {
    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        analyserContext = canvas.getContext('2d');
    }

    // analyzer draw code here
    {
        var SPACING = 3;
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
    clickRedBtn   : clickRedBtn,
    captureAudio  : captureAudio
  };


})();