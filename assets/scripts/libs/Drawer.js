var Drawer = (function(){

  var 	rafID, start, progress, 
  		progressBefore, canvasWidth,
  		canvasHeight, analyserCanvasContext;

  var drawFrequenciesCanvas = function(analyserNode, canvasID){

    // get HTML canvas from DOM and create its context
    if (!analyserCanvasContext) {
        var analyserCanvas    = document.getElementById(canvasID);

        canvasWidth           = analyserCanvas.width;
        canvasHeight          = analyserCanvas.height;
        analyserCanvasContext = analyserCanvas.getContext('2d');
    }

    // analyzer draw code here
    var SPACING = 3;
    var BAR_WIDTH = 2;
    var numBars = Math.round(canvasWidth / SPACING);
    var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

    analyserNode.getByteFrequencyData(freqByteData); 

    analyserCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    analyserCanvasContext.fillStyle = '#F6D565';
    analyserCanvasContext.lineCap = 'round';
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
        analyserCanvasContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
        analyserCanvasContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
    }


    rafID = window.requestAnimationFrame( function(timestamp){

      if (!start) start = timestamp;
      progress = Math.floor((timestamp - start)/1000);

      if(progress !== progressBefore){
        progressBefore = progress;
        console.log("time:", progress);
      }else{
        //console.log("frames per second");
      }

      //recursion
      drawFrequenciesCanvas(analyserNode);
    });

  }

  var stopDrawings = function(){
    window.cancelAnimationFrame(rafID);
  }


  //expose public vars and/or function
  return {
    drawFrequenciesCanvas   : drawFrequenciesCanvas,
    stopDrawings			: stopDrawings
  };

})();