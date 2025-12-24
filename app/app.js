let timerInterval
let isRunning = false
let isRainPlaying = false
let isWorkTime = true
let workMinutes = 25
let breakMinutes = 5
let totalSeconds = workMinutes * 60

const notificationSound = document.getElementById('notificationSound')
const rainSound = document.getElementById('rainSound')
const rainToggle = document.getElementById('rainToggle')
const flyingCat = document.getElementById('flyingCat')
const watcher = document.getElementById('watcher')
const time = document.getElementById('time')
const music = document.getElementById('rainToggle')
const minutesDisplay = document.getElementById('minutes')
const secondsDisplay = document.getElementById('seconds')
const motivationDisplay = document.getElementById('motivation')
const startBtn = document.getElementById('startBtn')
const resetBtn = document.getElementById('resetBtn')
const settingsBtn = document.getElementById('settingsBtn')
const settingsModal = document.getElementById('settingsModal')
const workTimeInput = document.getElementById('workTime')
const breakTimeInput = document.getElementById('breakTime')
const saveBtn = document.getElementById('saveBtn')
const cancelBtn = document.getElementById('cancelBtn')

const timeNow = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
})
time.textContent = timeNow
setInterval(() => {
    time.textContent = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })
}, 1000)

function updateDisplay() {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    minutesDisplay.textContent = String(mins).padStart(2, '0')
    secondsDisplay.textContent = String(secs).padStart(2, '0')
}

function startTimer() {
    if (isRunning) {
        pauseTimer()
        return
    }
    isRunning = true
    startBtn.textContent = 'Pause'
    watcher.classList.add('active')

    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--
            updateDisplay()
        } else {
            completeSession()
        }
    }, 1000)
}

function pauseTimer() {
    isRunning = false
    startBtn.textContent = 'Start'
    watcher.classList.remove('active')
    clearInterval(timerInterval)
}

function resetTimer() {
    pauseTimer()
    isWorkTime = true
    totalSeconds = workMinutes * 60
    updateDisplay()
    motivationDisplay.textContent = "You're doing great, don't stop now!";
}

function completeSession() {
    clearInterval(timerInterval)
    isRunning = false
    startBtn.textContent = 'Start'
    watcher.classList.remove('active')

    playNotificationSound()

    if (isWorkTime) {
        motivationDisplay.textContent = "Take a break now!"
        isWorkTime = false
        totalSeconds = breakMinutes * 60
    } else {
        motivationDisplay.textContent = "Break's over. Let's focus again!"
        isWorkTime = true
        totalSeconds = workMinutes * 60
    }

    updateDisplay()

    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
            body: isWorkTime ? 'Time to work!' : 'Time for break!',
            icon: '😺'
        })
    }
}

function playNotificationSound() {
    try {
        notificationSound.currentTime = 0
        notificationSound.play().catch(error => {
            console.error('Error playing notification sound:', error)
        })
        console.log('Notification sound played')
    } catch (error) {
        console.error('Error playing notification sound:', error)
    }
}

function toggleRainSound() {
    if (isRainPlaying) {
        rainSound.pause()
        rainSound.currentTime = 0
        rainToggle.classList.remove('active')
        isRainPlaying = false
    } else {
        rainSound.play().catch(error => {
            console.error('Error playing rain sound', error)
        })
        rainToggle.classList.add('active')
        isRainPlaying = true
    }
}

function openSettings() {
    workTimeInput.value = workMinutes
    breakTimeInput.value = breakMinutes
    settingsModal.classList.add('active')
}

function closeSettings() {
    settingsModal.classList.remove('active')
}

function saveSettings() {
    workMinutes = parseInt(workTimeInput.value) || 25
    breakMinutes = parseInt(breakTimeInput.value) || 5
    resetTimer()
    closeSettings()
}

startBtn.addEventListener('click', startTimer)
resetBtn.addEventListener('click', resetTimer)
settingsBtn.addEventListener('click', openSettings)
saveBtn.addEventListener('click', saveSettings)
cancelBtn.addEventListener('click', closeSettings)
rainToggle.addEventListener('click', toggleRainSound)

if ('Notification' in window) {
    Notification.requestPermission()
}

updateDisplay()