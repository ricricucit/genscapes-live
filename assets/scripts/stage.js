var Stage = (function() {

  //expose a global socket for client (this app)
  var socket = io();


  //expose a global socket for client (this app)
  var socket = io();
  var data = {"sound" : "555,5555,6,66,,6,76776"};
  
  socket.emit('stage-connect', data);

  var clickRedBtn = function(){
    socket.emit('clicked-red-button-stage', data);
  }

  //expose public vars and/or function
  return {
    socket        : socket,
    clickRedBtn   : clickRedBtn
  };

})();


var linein = (function(){

  

})();