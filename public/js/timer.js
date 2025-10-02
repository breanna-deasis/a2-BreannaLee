let timerOn = false;
let timer;
let timeLeft = 45 * 60;

const startPauseButton = document.getElementById('start-pause');
//const resetButton = document.getElementById('timerReset');
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");

function updateDisplay(){
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  minutesDisplay.textContent = String(minutes).padStart(2, '0');
  secondsDisplay.textContent = String(seconds).padStart(2, '0');
  debugger;
}

function startPause(){
  timerOn = !timerOn;
  if (timerOn) {
    startPauseButton.textContent = 'Pause';
    timer = setInterval(() => {
      if (timeLeft > 0){
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        alert('Good job!');
        startPauseButton.textContent = 'Start';
      }
    }, 1000)
  } else {
    startPauseButton.textContent = 'Start';
    clearInterval(timer);
  }
}

function timerReset(){
    clearInterval(timer);
    timerOn = false;
    timeLeft = 45 * 60;
    startPauseButton.textContent = 'Start';
    updateDisplay();
}

