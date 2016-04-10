/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

var videoElement = document.querySelector('video');
var audioInputSelect = document.querySelector('select#audioSource');
var audioOutputSelect = document.querySelector('select#audioOutput');
var videoSelect = document.querySelector('select#videoSource');
var selectors = [audioInputSelect, audioOutputSelect, videoSelect];

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  var values = selectors.map(function(select) {
    return select.value;
  });
  selectors.forEach(function(select) {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label ||
        'microphone ' + (audioInputSelect.length + 1);
      audioInputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'audiooutput') {
      option.text = deviceInfo.label || 'speaker ' +
          (audioOutputSelect.length + 1);
      audioOutputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
  selectors.forEach(function(select, selectorIndex) {
    if (Array.prototype.slice.call(select.childNodes).some(function(n) {
      return n.value === values[selectorIndex];
    })) {
      select.value = values[selectorIndex];
    }
  });
}

navigator.mediaDevices.enumerateDevices()
.then(gotDevices)
.catch(errorCallback);

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

// Attach audio output device to video element using device/sink ID.
function attachSinkId(element, sinkId) {
  if (typeof element.sinkId !== 'undefined') {
    element.setSinkId(sinkId)
    .then(function() {
      console.log('Success, audio output device attached: ' + sinkId);
    })
    .catch(function(error) {
      var errorMessage = error;
      if (error.name === 'SecurityError') {
        errorMessage = 'You need to use HTTPS for selecting audio output ' +
            'device: ' + error;
      }
      console.error(errorMessage);
      // Jump back to first output device in the list as it's the default.
      audioOutputSelect.selectedIndex = 0;
    });
  } else {
    console.warn('Browser does not support output device selection.');
  }
}

function changeAudioDestination() {
  var audioDestination = audioOutputSelect.value;
  attachSinkId(videoElement, audioDestination);
}

function start() {
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  var audioSource = audioInputSelect.value;
  var videoSource = videoSelect.value;
  var constraints = {
    audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    window.stream = stream; // make stream available to console
    videoElement.srcObject = stream;
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
  })
  .then(gotDevices)
  .catch(errorCallback);
}

audioInputSelect.onchange = start;
audioOutputSelect.onchange = changeAudioDestination;
videoSelect.onchange = start;


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

      if (window.stream) {
        window.stream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
      var audioSource = audioInputSelect.value;
      var videoSource = videoSelect.value;
      var constraints = {
        audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
        //video: {deviceId: videoSource ? {exact: videoSource} : undefined}
        video: false
      };
      navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        window.stream = stream; // make stream available to console
        resolve(stream);
        videoElement.srcObject = stream;
        // Refresh button list in case labels have become available
        return navigator.mediaDevices.enumerateDevices();
      })
      .then(gotDevices)
      .catch(errorCallback);


      // navigator.getUserMedia({
      //     audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      //     //audio: true,
      //     video: false
      // }, function(stream) {
          
      //     //Final:
      //     audioStream = stream;
      //     realAudioInput  = audioContext.createMediaStreamSource(stream);
      //     resolve(stream);

          
          

      //     // The Following structure creates this graph:
      //     // realAudioInput --> analyserNode --> audioProcessor

      //     // Create an AudioNode from realAudio (stream) (https://developer.mozilla.org/en-US/docs/Web/API/AudioNode)
      //     realAudioInput  = audioContext.createMediaStreamSource(stream);

      //     //create a new AudioNode (analyser) which can be used to expose
      //     //audio time and frequency to create data visualisations.
      //     analyserNode = audioContext.createAnalyser();

      //     //connect one output (real audio) node to the input of another node (gainNode).
      //     realAudioInput.connect(analyserNode);

      //     //Fast Fourier Transform Size 
      //     analyserNode.fftSize = 2048;
        
      //     var bufferSize  = 2048;
      //     //(bufferSize, nr. of input channels, nr. of output channels)
      //     audioProcessor                = audioContext.createScriptProcessor(bufferSize, 1, 1);
      //     audioProcessor.onaudioprocess = processCallback;
      //     audioProcessor.connect(audioContext.destination);

      //     resolve(analyserNode);
          


      // }, function(error) {
      //     //no UserMedia
      //     if(error){
      //       alert(JSON.stringify(error));
      //     }else{
      //       alert("no UserMedia");
      //     }
      // });

    });

  }


  var stopAudioCapture = function(){
    console.log("STOPPING STREAM: ", audioStream);
    audioStream.getTracks()[0].stop();
    //audioProcessor.disconnect(audioContext.destination);
  }

  //expose public vars and/or function
  return {
    captureAudio          : captureAudio,
    stopAudioCapture      : stopAudioCapture,
    analyserNode          : analyserNode
  };

})();