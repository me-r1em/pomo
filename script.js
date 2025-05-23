const aboutSection = document.getElementById('about');
const timerSection = document.getElementById('timerSection');
const tabBtns = document.querySelectorAll('.tab_btn');
const line = document.querySelector('.tab_box .line');
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

if (todoForm && todoInput && todoList) {
  todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const task = todoInput.value.trim();
    if (task) {
      const li = document.createElement('li');
      li.textContent = task;
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✕';
      removeBtn.className = 'todo-remove';
      removeBtn.onclick = function() {
        li.remove();
      };
      li.appendChild(removeBtn);
      todoList.appendChild(li);
      todoInput.value = '';
    }
  });
}

const bgUpload = document.getElementById('bgUpload');
if (bgUpload) {
  bgUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      document.body.style.backgroundImage = `url('${e.target.result}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'relative';
    };
    reader.readAsDataURL(file);
  });
}
const resetBgBtn = document.getElementById('resetBgBtn');
if (resetBgBtn) {
  resetBgBtn.addEventListener('click', function() {
    document.body.style.backgroundImage = "url('bg_v2.png')";
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'relative';
  });
}

const modeBtns = document.querySelectorAll('.mode_btn');

modeBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    modeBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
    if (this.dataset.mode === 'pomodoro') {
      currentDuration = pomodoroDuration;
    } else if (this.dataset.mode === 'short') {
      currentDuration = shortBreakDuration;
    } else if (this.dataset.mode === 'long') {
      currentDuration = longBreakDuration;
    }
    updateTimerDisplay();
  });
});

// Tab switching logic
tabBtns.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    moveLineToTab(btn);

    // Show About section only if About tab is clicked (index 2)
    if (idx === 2) {
      aboutSection.style.display = 'block';
      timerSection.style.display = 'none';
    } else if (idx === 1) { // Timer tab
      aboutSection.style.display = 'none';
      timerSection.style.display = 'block';
    } else { // Home tab
      aboutSection.style.display = 'none';
      timerSection.style.display = 'none';
    }
  });
});

const homeSection = document.getElementById('homeSection');
tabBtns.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    moveLineToTab(btn);
    if (idx === 0) { // Home tab
      homeSection.style.display = 'block';
      aboutSection.style.display = 'none';
      timerSection.style.display = 'none';
    } else if (idx === 1) { // Timer tab
      homeSection.style.display = 'none';
      aboutSection.style.display = 'none';
      timerSection.style.display = 'block';
    } else if (idx === 2) { // About tab
      homeSection.style.display = 'none';
      aboutSection.style.display = 'block';
      timerSection.style.display = 'none';
    }
  });
});
// On page load, show only Home section
homeSection.style.display = 'block';
aboutSection.style.display = 'none';
timerSection.style.display = 'none';

// Hide About and Timer sections by default on page load
aboutSection.style.display = 'none';
timerSection.style.display = 'none';

// Move line under active tab
function moveLineToTab(tab) {
  line.style.width = `${tab.offsetWidth}px`;
  line.style.left = `${tab.offsetLeft}px`;
}

// Initialize line position on page load
document.addEventListener("DOMContentLoaded", function() {
  const activeTab = document.querySelector('.tab_btn.active');
  if (activeTab) {
    moveLineToTab(activeTab);
    // Show correct section on load
    const idx = Array.from(tabBtns).indexOf(activeTab);
    if (idx === 2) {
      aboutSection.style.display = 'block';
      timerSection.style.display = 'none';
    } else if (idx === 1) {
      aboutSection.style.display = 'none';
      timerSection.style.display = 'block';
    } else {
      aboutSection.style.display = 'none';
      timerSection.style.display = 'none';
    }
  }
});

// TIMER LOGIC
let pomodoroDuration = 25 * 60;
let shortBreakDuration = 5 * 60;
let longBreakDuration = 15 * 60;
let currentDuration = pomodoroDuration;
let timerInterval;
let isPaused = false;

function updateTimerDisplay() {
  const minutes = Math.floor(currentDuration / 60).toString().padStart(2, '0');
  const seconds = (currentDuration % 60).toString().padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (!isPaused && currentDuration > 0) {
      currentDuration--;
      updateTimerDisplay();
    }
    if (currentDuration === 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      showNotification(); // Show notification when time's up
    }
  }, 1000);
}

function pauseTimer() {
  isPaused = !isPaused;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  currentDuration = pomodoroDuration;
  updateTimerDisplay();
}

// SETTINGS MODAL LOGIC
document.getElementById('openSettingsBtn').onclick = function() {
  document.getElementById('settingsModal').style.display = 'flex';
  document.getElementById('pomodoroInput').value = pomodoroDuration / 60;
  document.getElementById('shortBreakInput').value = shortBreakDuration / 60;
  document.getElementById('longBreakInput').value = longBreakDuration / 60;
};
document.getElementById('closeSettingsBtn').onclick = function() {
  document.getElementById('settingsModal').style.display = 'none';
};
document.getElementById('saveSettingsBtn').onclick = function() {
  pomodoroDuration = parseInt(document.getElementById('pomodoroInput').value, 10) * 60;
  shortBreakDuration = parseInt(document.getElementById('shortBreakInput').value, 10) * 60;
  longBreakDuration = parseInt(document.getElementById('longBreakInput').value, 10) * 60;
  currentDuration = pomodoroDuration;
  updateTimerDisplay();
  document.getElementById('settingsModal').style.display = 'none';
};

// NOTIFICATION LOGIC
function showNotification() {
  document.getElementById('notification').style.display = 'block';
}
function hideNotification() {
  document.getElementById('notification').style.display = 'none';
}
document.getElementById('closeNotificationBtn').onclick = hideNotification;

// Initialize timer display
updateTimerDisplay();
