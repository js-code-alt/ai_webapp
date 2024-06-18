document.addEventListener("DOMContentLoaded", function() {
  let startButton = document.getElementById("start-consultation");
  let stopButton = document.getElementById("stop-consultation");
  let timerDisplay = document.getElementById("timer");
  let mediaRecorder;
  let chunks = [];
  let timer;
  let seconds = 0;

  startButton.addEventListener("click", function() {
      startButton.style.display = 'none';
      stopButton.style.display = 'block';
      startRecording();
  });

  stopButton.addEventListener("click", function() {
      stopButton.style.display = 'none';
      startButton.style.display = 'block';
      stopRecording();
  });

  function startRecording() {
      navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
              mediaRecorder = new MediaRecorder(stream);
              mediaRecorder.start();

              mediaRecorder.ondataavailable = function(e) {
                  chunks.push(e.data);
              };

              mediaRecorder.onstop = function() {
                  let blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                  chunks = [];
                  let audioURL = window.URL.createObjectURL(blob);
                  uploadAudio(blob);
              };

              startTimer();
          })
          .catch(error => {
              console.error("Error accessing microphone: ", error);
          });
  }

  function stopRecording() {
      mediaRecorder.stop();
      clearInterval(timer);
      seconds = 0;
  }

  function startTimer() {
      timer = setInterval(() => {
          seconds++;
          let minutes = Math.floor(seconds / 60);
          let displaySeconds = seconds % 60;
          timerDisplay.textContent = `${minutes}:${displaySeconds < 10 ? '0' : ''}${displaySeconds}`;
      }, 1000);
  }

  function uploadAudio(blob) {
    let formData = new FormData();
    formData.append('audio', blob, 'recording.ogg');

    fetch('/upload_audio', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            console.log("Audio uploaded successfully");
        } else {
            console.error("Failed to upload audio");
        }
    }).catch(error => {
        console.error("Error uploading audio: ", error);
    });
  }
});
