// Dark Mode Toggle
const darkModeCheckbox = document.getElementById('darkModeCheckbox');
const body = document.body;

// Task Management
const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskList = document.getElementById('taskList');
const reminderInput = document.getElementById('reminderInput');

// Filter Tasks
const filterSelect = document.getElementById('filterSelect');

// Task Array
let tasks = [];

// Load tasks from local storage (if any)
function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = storedTasks;
    renderTasks();
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks on the page
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add(task.priority);

        // Checkbox for task completion
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

        // Task Text
        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.completed) {
            span.classList.add('completed');  // Add 'completed' class when the task is done
        }

        // Priority Badge
        const priorityBadge = document.createElement('span');
        priorityBadge.classList.add('priority', task.priority);
        priorityBadge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        // Append elements to list item
        li.append(checkbox, span, priorityBadge, deleteBtn);
        taskList.appendChild(li);

        // Set reminder if specified
        if (task.reminder) {
            setReminder(task.reminder, task.text);
        }
    });
}

// Add a new task
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    const reminderTime = reminderInput.value;

    if (taskText) {
        const newTask = {
            id: Date.now(),
            text: taskText,
            priority: priority,
            completed: false,
            reminder: reminderTime || null
        };
        tasks.push(newTask);
        taskInput.value = '';  // Clear the input field
        reminderInput.value = '';  // Clear the reminder input field
        saveTasks();
        renderTasks();
    }
});

// Toggle task completion
function toggleTaskCompletion(taskId) {
    const task = tasks.find(task => task.id === taskId);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

// Set reminder notification
function setReminder(reminderTime, taskText) {
    const reminderDate = new Date(reminderTime);
    const now = new Date();

    if (reminderDate > now) {
        const timeToWait = reminderDate - now;

        setTimeout(() => {
            alert(`Reminder: Time to complete your task - "${taskText}"`);
        }, timeToWait);
    }
}

// Filter tasks based on user selection
filterSelect.addEventListener('change', (e) => {
    const filter = e.target.value;
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'completed') return task.completed;
        if (filter === 'not-completed') return !task.completed;
        if (filter === 'high-priority') return task.priority === 'high';
        if (filter === 'medium-priority') return task.priority === 'medium';
        if (filter === 'low-priority') return task.priority === 'low';
        return false;
    });
    renderFilteredTasks(filteredTasks);
});

// Render filtered tasks
function renderFilteredTasks(filteredTasks) {
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add(task.priority);
        const span = document.createElement('span');
        span.textContent = task.text;
        li.appendChild(span);
        taskList.appendChild(li);
    });
}

// Dark mode toggle handler
darkModeCheckbox.addEventListener('change', () => {
    body.classList.toggle('dark', darkModeCheckbox.checked);
    const modeText = document.getElementById('modeText');
    modeText.textContent = darkModeCheckbox.checked ? 'Light Mode' : 'Dark Mode';
});

// Load tasks initially
loadTasks();

// Update the clock every second
setInterval(updateClock, 1000);

// Function to update the clock
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

