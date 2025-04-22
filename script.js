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
let notes = [];

function createNote() {
    document.getElementById("noteModal").style.display = "flex";
    document.getElementById("noteContent").value = '';
}

function saveNote() {
    const content = document.getElementById("noteContent").value.trim();
    if (content) {
        notes.push({ id: Date.now(), content });
        displayNotes();
        closeModal();
    }
}

function closeModal() {
    document.getElementById("noteModal").style.display = "none";
}

function displayNotes() {
    const noteList = document.getElementById("noteList");
    noteList.innerHTML = '';

    notes.forEach(note => {
        const noteItem = document.createElement("div");
        noteItem.className = "note-item";
        
        const noteText = document.createElement("p");
        noteText.textContent = note.content.length > 30 ? note.content.slice(0, 30) + "..." : note.content;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteNote(note.id);
        
        noteItem.appendChild(noteText);
        noteItem.appendChild(deleteBtn);
        
        noteList.appendChild(noteItem);
    });
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    displayNotes();
}

function searchNotes() {
    const searchQuery = document.getElementById("search").value.toLowerCase();
    const filteredNotes = notes.filter(note => note.content.toLowerCase().includes(searchQuery));
    
    const noteList = document.getElementById("noteList");
    noteList.innerHTML = '';
    
    filteredNotes.forEach(note => {
        const noteItem = document.createElement("div");
        noteItem.className = "note-item";
        
        const noteText = document.createElement("p");
        noteText.textContent = note.content.length > 30 ? note.content.slice(0, 30) + "..." : note.content;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteNote(note.id);
        
        noteItem.appendChild(noteText);
        noteItem.appendChild(deleteBtn);
        
        noteList.appendChild(noteItem);
    });
}

// Initial display of notes
displayNotes();
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let events = [];

function openEventModal() {
    document.getElementById("eventModal").style.display = "flex";
}

function closeEventModal() {
    document.getElementById("eventModal").style.display = "none";
}

function saveEvent() {
    const title = document.getElementById("eventTitle").value.trim();
    const description = document.getElementById("eventDescription").value.trim();

    if (title && description) {
        const event = {
            title,
            description,
            date: selectedDate
        };
        events.push(event);
        closeEventModal();
        displayCalendar();
    }
}

function displayCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarGrid = document.getElementById("calendarGrid");
    calendarGrid.innerHTML = '';

    document.getElementById("month-year").innerText = `${getMonthName(currentMonth)} ${currentYear}`;

    // Create empty cells before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        calendarGrid.appendChild(emptyCell);
    }

    // Create cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.innerText = day;
        dayCell.onclick = () => showDayEvents(day);

        const eventOnDay = events.filter(event => new Date(event.date).getDate() === day);
        if (eventOnDay.length > 0) {
            const eventLabel = document.createElement("div");
            eventLabel.innerText = `${eventOnDay.length} Event(s)`;
            eventLabel.style.fontSize = '0.8em';
            eventLabel.style.color = '#ff5722';
            dayCell.appendChild(eventLabel);
        }

        calendarGrid.appendChild(dayCell);
    }
}

function showDayEvents(day) {
    selectedDate = new Date(currentYear, currentMonth, day);
    const dayEvents = events.filter(event => new Date(event.date).getDate() === day);
    
    if (dayEvents.length > 0) {
        let eventsList = `Events for ${day} ${getMonthName(currentMonth)} ${currentYear}:<br>`;
        dayEvents.forEach(event => {
            eventsList += `<strong>${event.title}</strong><br>${event.description}<br><br>`;
        });
        alert(eventsList);
    } else {
        alert(`No events for ${day} ${getMonthName(currentMonth)} ${currentYear}`);
    }
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    displayCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    displayCalendar();
}

function getMonthName(monthIndex) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
}

// Initial call to display the calendar
displayCalendar();
let habits = [];

function openHabitModal() {
  document.getElementById("habitModal").style.display = "flex";
}

function closeHabitModal() {
  document.getElementById("habitModal").style.display = "none";
}

function addHabit() {
  const name = document.getElementById("habitName").value.trim();
  if (!name) return;

  const habit = {
    id: Date.now(),
    name,
    progress: Array(7).fill(false) // 7-day weekly tracker
  };

  habits.push(habit);
  renderHabits();
  closeHabitModal();
  document.getElementById("habitName").value = "";
}

function toggleDay(habitId, dayIndex) {
  const habit = habits.find(h => h.id === habitId);
  if (habit) {
    habit.progress[dayIndex] = !habit.progress[dayIndex];
    renderHabits();
  }
}

function renderHabits() {
  const list = document.getElementById("habitList");
  list.innerHTML = "";

  habits.forEach(habit => {
    const card = document.createElement("div");
    card.className = "habit-card";

    const title = document.createElement("div");
    title.className = "habit-title";
    title.textContent = habit.name;

    const tracker = document.createElement("div");
    tracker.className = "tracker";

    for (let i = 0; i < 7; i++) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = habit.progress[i];
      checkbox.onclick = () => toggleDay(habit.id, i);
      tracker.appendChild(checkbox);
    }

    card.appendChild(title);
    card.appendChild(tracker);
    list.appendChild(card);
  });
}

// Initial render
renderHabits();
