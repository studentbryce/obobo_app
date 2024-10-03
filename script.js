// Tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Stopwatch and Lap Timer variables
let stopwatchTime = 0;  // Start at 0 milliseconds for Stopwatch
let laptimerTime = 0;   // Start at 0 milliseconds for Lap Timer
let previousLapTime = 0;  // To store the time of the last lap for relative lap times
let stopwatchInterval, laptimerInterval;
let isStopwatchRunning = false;  // Separate state for Stopwatch running flag
let isLaptimerRunning = false;  // Separate state for Lap Timer running flag
let laps = [];

// Function to format time using the default ISO format, returning hh:mm:ss.SS
function formatTime(ms) {
    const date = new Date(ms);
    return date.toISOString().substr(11, 11);  // Extracts time in hh:mm:ss.SS format
}

// Function to update the display of the time for a specific timer
function updateDisplay(timerId, time) {
    document.querySelector(`#${timerId} .time-display`).textContent = formatTime(time);
}

// Start or stop the specified timer (Stopwatch or Lap Timer)
function startStop(timerId) {
    const button = document.querySelector(`#${timerId}-startstop`);
    
    // Logic for Stopwatch
    if (timerId === 'stopwatch') {
        if (isStopwatchRunning) {
            // Stop the Stopwatch
            clearInterval(stopwatchInterval);
            button.textContent = 'Start';
        } else {
            // Start the Stopwatch
            stopwatchInterval = setInterval(() => {
                stopwatchTime += 10;  // Increment time by 10 milliseconds
                updateDisplay(timerId, stopwatchTime);
            }, 10);
            button.textContent = 'Stop';
        }
        isStopwatchRunning = !isStopwatchRunning;  // Toggle the Stopwatch running state
    
    // Logic for Lap Timer
    } else if (timerId === 'laptimer') {
        if (isLaptimerRunning) {
            // Stop the Lap Timer
            clearInterval(laptimerInterval);
            button.textContent = 'Start';
        } else {
            // Start the Lap Timer
            laptimerInterval = setInterval(() => {
                laptimerTime += 10;  // Increment time by 10 milliseconds
                updateDisplay(timerId, laptimerTime);
            }, 10);
            button.textContent = 'Stop';
        }
        isLaptimerRunning = !isLaptimerRunning;  // Toggle the Lap Timer running state
    }
}

// Reset the specified timer (Stopwatch or Lap Timer)
function reset(timerId) {
    // Stop the appropriate timer interval
    clearInterval(timerId === 'stopwatch' ? stopwatchInterval : laptimerInterval);
    
    // Reset Stopwatch
    if (timerId === 'stopwatch') {
        stopwatchTime = 0;  // Reset the time to 0 milliseconds
        isStopwatchRunning = false;  // Ensure Stopwatch is not running
    
    // Reset Lap Timer
} else if (timerId === 'laptimer') {
    laptimerTime = 0;  // Reset the time to 0 milliseconds
    previousLapTime = 0;  // Reset the previous lap time
    isLaptimerRunning = false;  // Ensure Lap Timer is not running
    laps = [];  // Clear the lap records
    document.getElementById('lap-list').innerHTML = '';  // Clear lap display
}
    
    // Update the display to show 00:00:00.00
    updateDisplay(timerId, 0);
    document.querySelector(`#${timerId}-startstop`).textContent = 'Start';  // Reset button text to 'Start'
}

// Stopwatch controls
document.getElementById('stopwatch-startstop').addEventListener('click', () => startStop('stopwatch'));
document.getElementById('stopwatch-reset').addEventListener('click', () => reset('stopwatch'));

// Lap Timer controls
document.getElementById('laptimer-startstop').addEventListener('click', () => startStop('laptimer'));
document.getElementById('laptimer-reset').addEventListener('click', () => reset('laptimer'));
document.getElementById('laptimer-lap').addEventListener('click', () => {
    // Only record a lap if the timer is running
    if (isLaptimerRunning) {
        // Calculate the time difference between the current lap and the last lap
        const lapTime = laptimerTime - previousLapTime;
        previousLapTime = laptimerTime;  // Update the last lap time

        laps.push(lapTime);  // Add current Lap Timer time to laps array
        const lapItem = document.createElement('div');
        lapItem.classList.add('lap-item');
        // Display lap number and calculated lap time
        lapItem.innerHTML = `<span>Lap ${laps.length}</span><span>${formatTime(lapTime)}</span>`;
        document.getElementById('lap-list').prepend(lapItem);  // Add the lap to the lap list
    }
});

// Alarm functionality
let alarmTime;
let alarmTimeout;
const alarmSound = document.getElementById('alarm-sound');
function playAlarmSound() {
    alarmSound.play();
}
function stopAlarmSound() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
}
document.getElementById('alarm-set').addEventListener('click', () => {
    const input = document.getElementById('alarm-time');
    const alarmButton = document.getElementById('alarm-set');
    if (alarmButton.textContent === 'Set Alarm') {
        const now = new Date();
        const [hours, minutes] = input.value.split(':');
        const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        if (alarmDate <= now) {
            alarmDate.setDate(alarmDate.getDate() + 1);
        }
        const timeDiff = alarmDate - now;
        clearTimeout(alarmTimeout);
        alarmTimeout = setTimeout(() => {
            document.getElementById('alarm-display').textContent = 'ALARM!';
            document.getElementById('alarm-display').classList.add('alarm-ringing');
            playAlarmSound();
        }, timeDiff);
        alarmTime = input.value;
        document.getElementById('alarm-display').textContent = `Alarm set for ${alarmTime}`;
        alarmButton.textContent = 'Cancel Alarm';
    } else {
        clearTimeout(alarmTimeout);
        stopAlarmSound();
        document.getElementById('alarm-display').textContent = '';
        document.getElementById('alarm-display').classList.remove('alarm-ringing');
        alarmButton.textContent = 'Set Alarm';
        alarmTime = null;
    }
});

// Update clock every second
setInterval(() => {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0];
    if (currentTime.startsWith(alarmTime)) {
        document.getElementById('alarm-display').textContent = 'ALARM!';
        document.getElementById('alarm-display').classList.add('alarm-ringing');
        playAlarmSound();
    }
}, 1000);