var Stage = (function() {

	//expose a global socket for client (this app)
	var socket = io();
	var data = {
		"color": '#' + Math.floor(Math.random() * 16777215).toString(16)
	};

	socket.emit('stage-connect', data);

	var clickRedBtn = function() {
		socket.emit('clicked-red-button-stage', data);
	}

  var keyCodePressed = '';

  var keyPress = function(e){
    keyCodePressed = e.code;
    socket.emit('key-codes',{'keyCode': e.code});
  };


  var drawKeys = function(){
    if (monitor==undefined) {
        var monitor = document.getElementById('keysMonitor');
    }

    monitor.innerHTML = keyCodePressed;
    window.requestAnimationFrame(drawKeys);
  }

  window.addEventListener('keypress',keyPress);
  window.addEventListener('keyup', function(){ keyCodePressed = '' });
  drawKeys();
	//expose public vars and/or functions
	return {
		socket: socket,
		clickRedBtn: clickRedBtn
	};

})();
