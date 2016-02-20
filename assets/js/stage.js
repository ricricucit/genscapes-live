var stage = (function(){

  //expose a global socket for client (this app)
  var socket = io();
  var data = {"color" : '#'+Math.floor(Math.random()*16777215).toString(16)};
  
  socket.emit('stage-connect', data);

  var clickRedBtn = function(){
    socket.emit('clicked-red-button-stage', data);
  }

  //expose public vars and/or functions
  return {
    socket        : socket,
    clickRedBtn   : clickRedBtn
  };

})();