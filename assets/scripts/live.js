var Live = (function(){

  //expose a global socket for client (this app)
  var socket = io();
  var data = {"color" : '#'+Math.floor(Math.random()*16777215).toString(16)};
  
  socket.emit('client-connect', data);
  
  socket.on('changeBkgColor', function(data){
    document.body.style.background = 'blue';
  });

  var clickRedBtn = function(){
    socket.emit('clicked-red-button', data);
  }

  //expose public vars and/or function
  return {
    socket        : socket,
    clickRedBtn   : clickRedBtn
  };

})();