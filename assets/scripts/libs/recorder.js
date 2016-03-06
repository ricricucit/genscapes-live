var Recorder = (function() {  
    var startRecording = document.getElementById('start-recording');
    var stopRecording = document.getElementById('stop-recording');
    var cameraPreview = document.getElementById('camera-preview');

    var audio = document.querySelector('audio');

    var isFirefox = !!navigator.mozGetUserMedia;

    var recordAudio, recordVideo;
    startRecording.onclick = function() {
        startRecording.disabled = true;
        navigator.getUserMedia({
                audio: true,
                video: true
            }, function(stream) {
                cameraPreview.src = window.URL.createObjectURL(stream);
                cameraPreview.play();

                recordAudio = RecordRTC(stream, {
                    bufferSize: 16384
                });

                if (!isFirefox) {
                    recordVideo = RecordRTC(stream, {
                        type: 'video'
                    });
                }

                recordAudio.startRecording();

                if (!isFirefox) {
                    recordVideo.startRecording();
                }

                stopRecording.disabled = false;
            }, function(error) {
                alert(JSON.stringify(error));
            });
    };


    stopRecording.onclick = function() {
        startRecording.disabled = false;
        stopRecording.disabled = true;

        recordAudio.stopRecording(function() {
            if (isFirefox) onStopRecording();
        });

        if (!isFirefox) {
            recordVideo.stopRecording();
            onStopRecording();
        }

        function onStopRecording() {
            recordAudio.getDataURL(function(audioDataURL) {
                if (!isFirefox) {
                    recordVideo.getDataURL(function(videoDataURL) {
                        postFiles(audioDataURL, videoDataURL);
                    });
                } else postFiles(audioDataURL);
            });
        }
    };

    var fileName;

    function postFiles(audioDataURL, videoDataURL) {
        fileName = getRandomString();
        var files = { };

        files.audio = {
            name: fileName + (isFirefox ? '.webm' : '.wav'),
            type: isFirefox ? 'video/webm' : 'audio/wav',
            contents: audioDataURL
        };

        if (!isFirefox) {
            files.video = {
                name: fileName + '.webm',
                type: 'video/webm',
                contents: videoDataURL
            };
        }

        files.isFirefox = isFirefox;

        cameraPreview.src = '';
        cameraPreview.poster = '/ajax-loader.gif';

        xhr('/upload', JSON.stringify(files), function(_fileName) {
            var href = location.href.substr(0, location.href.lastIndexOf('/') + 1);
            cameraPreview.src = href + 'uploads/' + _fileName;
            cameraPreview.play();

            var h2 = document.createElement('h2');
            h2.innerHTML = '<a href="' + cameraPreview.src + '">' + cameraPreview.src + '</a>';
            document.body.appendChild(h2);
        });
    }

    function xhr(url, data, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseText);
            }
        };
        request.open('POST', url);
        request.send(data);
    }

    window.onbeforeunload = function() {
        startRecording.disabled = false;
    };

    function getRandomString() {
        if (window.crypto) {
            var a = window.crypto.getRandomValues(new Uint32Array(3)),
                token = '';
            for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
            return token;
        } else {
            return (Math.random() * new Date().getTime()).toString(36).replace( /\./g , '');
        }
    }
})();