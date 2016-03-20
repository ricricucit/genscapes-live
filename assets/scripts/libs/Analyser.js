var Analyser = (function(){

  var audioContext    = new AudioContext();
  var realAudioInput  = null,
      analyserNode    = null;
  var analyserCanvasContext = null;
  var audioStream;
  var audioProcessor  = null;

  var captureAudio = function(processCallback){

    navigator.getUserMedia = ( navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia ||
                               navigator.msGetUserMedia);


    return new Promise(function(resolve, reject) {

      navigator.getUserMedia({
          audio: true,
          video: false
      }, function(stream) {
          
          resolve(stream);

          /*
          audioStream = stream;

          // The Following structure creates this graph:
          // realAudioInput --> analyserNode --> audioProcessor

          // Create an AudioNode from realAudio (stream) (https://developer.mozilla.org/en-US/docs/Web/API/AudioNode)
          realAudioInput  = audioContext.createMediaStreamSource(stream);

          //create a new AudioNode (analyser) which can be used to expose
          //audio time and frequency to create data visualisations.
          analyserNode = audioContext.createAnalyser();

          //connect one output (real audio) node to the input of another node (gainNode).
          realAudioInput.connect(analyserNode);

          //Fast Fourier Transform Size 
          analyserNode.fftSize = 2048;
        
          var bufferSize  = 2048;
          //(bufferSize, nr. of input channels, nr. of output channels)
          audioProcessor                = audioContext.createScriptProcessor(bufferSize, 1, 1);
          audioProcessor.onaudioprocess = processCallback;
          audioProcessor.connect(audioContext.destination);

          resolve(analyserNode);
          */

      }, function(error) {
          //no UserMedia
          if(error){
            alert(JSON.stringify(error));
          }else{
            alert("no UserMedia");
          }
      });

    });

  }


  var stopAudioCapture = function(){
    console.log("STOPPING STREAM: ", audioStream);
    audioStream.getTracks()[0].stop();
    audioProcessor.disconnect(audioContext.destination);
  }

  //expose public vars and/or function
  return {
    captureAudio          : captureAudio,
    stopAudioCapture      : stopAudioCapture,
    analyserNode          : analyserNode
  };

})();