var Stage = (function() {  

  //expose a global socket for client (this app)
  var socket = io();
  var data = {"sound" : "555,5555,6,66,,6,76776"};

  var html_out = document.getElementById("output");
  
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
        
        console.log(stream);
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
    console.log(left.length);
  }

  
  //expose public vars and/or function
  return {
    socket        : socket,
    clickRedBtn   : clickRedBtn,
    captureAudio  : captureAudio
  };


})();