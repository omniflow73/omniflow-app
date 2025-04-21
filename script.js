// Default tab
window.onload = () => {
  showTab('tasks');
  loadTasks();
  loadCalendarEvents();
  loadHabits();
  loadNotes();
};

// Tab switching
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
}

// Tasks
function addTask() {
  const input = document.getElementById('taskInput');
  const value = input.value.trim();
  if (!value) return;
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.push({ text: value, done: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  input.value = '';
  loadTasks();
}

function loadTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.done) li.style.textDecoration = 'line-through';
    li.onclick = () => {
      tasks[i].done = !tasks[i].done;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      loadTasks();
    };
    list.appendChild(li);
  });
}

// Calendar
function addCalendarEvent() {
  const date = document.getElementById('calendarDate').value;
  const event = document.getElementById('calendarEvent').value.trim();
  if (!date || !event) return;
  const events = JSON.parse(localStorage.getItem('calendar') || '{}');
  if (!events[date]) events[date] = [];
  events[date].push(event);
  localStorage.setItem('calendar', JSON.stringify(events));
  loadCalendarEvents();
}

function loadCalendarEvents() {
  const list = document.getElementById('calendarList');
  list.innerHTML = '';
  const events = JSON.parse(localStorage.getItem('calendar') || '{}');
  for (let date in events) {
    const dateItem = document.createElement('li');
    dateItem.innerHTML = `<strong>${date}</strong>: ${events[date].join(', ')}`;
    list.appendChild(dateItem);
  }
}

// Pomodoro Timer
let timer;
let timeLeft = 25 * 60;

function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) resetTimer();
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  timeLeft = 25 * 60;
  updateTimer();
}

function updateTimer() {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  document.getElementById('timerDisplay').textContent =
    `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Habits
function addHabit() {
  const input = document.getElementById('habitInput');
  const value = input.value.trim();
  if (!value) return;
  const habits = JSON.parse(localStorage.getItem('habits') || '[]');
  habits.push({ name: value, streak: 0 });
  localStorage.setItem('habits', JSON.stringify(habits));
  input.value = '';
  loadHabits();
}

function loadHabits() {
  const list = document.getElementById('habitList');
  list.innerHTML = '';
  const habits = JSON.parse(localStorage.getItem('habits') || '[]');
  habits.forEach((habit, i) => {
    const li = document.createElement('li');
    li.textContent = `${habit.name} – Streak: ${habit.streak}`;
    li.onclick = () => {
      habit.streak++;
      localStorage.setItem('habits', JSON.stringify(habits));
      loadHabits();
    };
    list.appendChild(li);
  });
}

// Notes
function saveNote() {
  const input = document.getElementById('noteInput');
  const value = input.value.trim();
  if (!value) return;
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.unshift({ text: value, date: new Date().toLocaleString() });
  localStorage.setItem('notes', JSON.stringify(notes));
  input.value = '';
  loadNotes();
}

function loadNotes() {
  const list = document.getElementById('noteList');
  list.innerHTML = '';
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.forEach(note => {
    const li = document.createElement('li');
    li.textContent = `[${note.date}] ${note.text}`;
    list.appendChild(li);
  });
}
