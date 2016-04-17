var Live = (function(Utils, Drawer) {

  //expose a global socket for client (this app)
  var socket = io();
  var data = {};
  //var peer = new Peer('live', {host: '192.168.1.105', port: 4001, path: '/rt'});
  var peer = new Peer('live', { host: '192.168.1.105',
                                port: 3002,
                                path: '/rt',
                                debug: 3,
                                config: {'iceServers': [
                                                    { 'url': 'stun:stun.l.google.com:19302' },
                                                    { 'url': 'stun:stun.l.google.com:19302'  },
                                                    { 'url': 'stun:stun1.l.google.com:19302' },
                                                    { 'url': 'stun:stun2.l.google.com:19302' },
                                                    { 'url': 'stun:stun3.l.google.com:19302' },
                                                    { 'url': 'stun:stun4.l.google.com:19302' },
                                                    { 'url': 'stun:stun.ekiga.net' },
                                                    { 'url': 'stun:stun.ideasip.com' },
                                                    { 'url': 'stun:stun.rixtelecom.se' },
                                                    { 'url': 'stun:stun.schlund.de'  },
                                                    { 'url': 'stun:stun.stunprotocol.org:3478' },
                                                    { 'url': 'stun:stun.voiparound.com'  },
                                                    { 'url': 'stun:stun.voipbuster.com'  },
                                                    { 'url': 'stun:stun.voipstunt.com' },
                                                    { 'url': 'stun:stun.voxgratia.org' },
                                                    {
                                                      url: 'turn:numb.viagenie.ca',
                                                      credential: 'Ricucit2.',
                                                      username: 'enrico.icardi@gmail.com'
                                                    }
                                                  ]}
                              });

  var audioContext    = new AudioContext();
  var realAudioInput  = null,
      analyserNode    = null;

  var streamFromStage = {};

  //connect to socket
  var user_id         = Utils.userIDgenerator();
  data                = {'user_id': user_id};

  socket.emit('live-connect', data);


  peer.on('connection', function(conn) {
    conn.on('data', function(data){
      // Will print 'hi!'
      console.log(data);
    });
  });


  peer.on('call', function(call) {
    // Answer the call, providing our mediaStream
    call.answer();

    call.on('stream', function(remoteStream){
      // Show stream in some video/canvas element.
      console.log('Stream HERE!',remoteStream);

      streamFromStage = remoteStream;

      // The Following structure creates this graph:
      // realAudioInput --> analyserNode --> audioProcessor

      //analyserNode.connect(audioContext.destination);

      setTimeout(function(ev){


        var audio_elem = document.createElement("audio");
        audio_elem.src = URL.createObjectURL(remoteStream);
        //audio_elem.play();

        realAudioInput  = audioContext.createMediaStreamSource(remoteStream);
        analyserNode = audioContext.createAnalyser();
        realAudioInput.connect(analyserNode);
        analyserNode.fftSize = 2048;

        draw(analyserNode);
      }, 2000);



    });

  });

  var draw = function(analyserNode){
    console.log("start drawing!");

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

  socket.on('cloud-joined', function(data){
    alert('cloud is connected...now calling cloud!');
    var call = peer.call('cloud', streamFromStage);

    console.log('cloud is here!', data);
  });

  socket.on('changeBkgColor', function(data){
    document.body.style.background = 'green';
  });

  socket.on('stop-drawings', function(data){
    stopDrawings();
  });

   socket.on('audio-received', function(data){
    console.log("Audio received!", data);
  });

  socket.on('change-color', function(data){
    Drawer.changeColor();
  });

  var clickRedBtn = function(){
    socket.emit('clicked-red-button-live', data);
  }


  var stopDrawings = function(){
    Drawer.stopDrawings();
  }



  //expose public vars and/or function
  return {
    socket            : socket,
    clickRedBtn       : clickRedBtn,
    stopDrawings      : stopDrawings
  };


})(Utils, Drawer);