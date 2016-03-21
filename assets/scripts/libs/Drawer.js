var Drawer = (function(){

  var rafID, start, progress, progressBefore;
  var SPACING = 20;
  var BAR_WIDTH = 20;

  var drawFrequenciesCanvas = function(analyserNode, canvas){

    // analyzer draw code here
    var numBars = Math.round(canvas.width / SPACING);
    var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

    analyserNode.getByteFrequencyData(freqByteData); 

    canvas.context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.context.fillStyle = '#006600';
    canvas.context.lineCap = 'round';
    var multiplier = analyserNode.frequencyBinCount / numBars;

    // Draw rectangle for each frequency bin.
    for (var i = 0; i < numBars; ++i) {
        var magnitude = 0;
        var offset = Math.floor( i * multiplier );
        // gotta sum/average the block, or we miss narrow-bandwidth spikes
        for (var j = 0; j< multiplier; j++)
            magnitude += freqByteData[offset + j];
        magnitude = magnitude / multiplier;
        console.log(magnitude);
        var magnitude2 = freqByteData[i * multiplier];
        canvas.context.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
        canvas.context.fillRect(i * SPACING, canvas.height, BAR_WIDTH, -magnitude);
    }


    rafID = window.requestAnimationFrame( function(timestamp){

      if (!start) start = timestamp;
      progress = Math.floor((timestamp - start)/1000);

      if(progress !== progressBefore){
        progressBefore = progress;
      }else{
        //console.log("frames per second");
      }

      //recursion
      drawFrequenciesCanvas(analyserNode, canvas);
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