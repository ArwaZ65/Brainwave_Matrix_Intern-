const addBtn = document.getElementById('addBtn');
const taskNameInput = document.getElementById('task-name');
const taskDescriptionInput = document.getElementById('description');
const taskDateInput = document.getElementById('task-date');
const tasksContainer = document.getElementById('tasks-container');
const completeContainer = document.getElementById('completeContainer');

let tasks = [];
let completedTasks = [];
let editIndex = null;

// Add task event listener
addBtn.addEventListener('click', () => {
    const taskName = taskNameInput.value;
    const taskDescription = taskDescriptionInput.value;
    const taskDate = taskDateInput.value;

    if (taskName && taskDescription && taskDate) {
        if (editIndex !== null) {
            // Update existing task
            tasks[editIndex] = { name: taskName, description: taskDescription, date: taskDate };
            editIndex = null; // Reset edit index
        } else {
            // Add new task
            tasks.push({ name: taskName, description: taskDescription, date: taskDate });
        }
        renderTasks();
        taskNameInput.value = '';
        taskDescriptionInput.value = '';
        taskDateInput.value = '';
    }
});

// Render tasks function
function renderTasks() {
    tasksContainer.innerHTML = tasks.map((task, index) => `
        <div class="task-item">
            <input type="checkbox" id="task-${index}" onchange="toggleComplete(${index})">
            <label for="task-${index}"><strong>${task.name}</strong></label>
            <p>${task.description}</p>
            <p><small>${task.date}</small></p>
            <i class="fas fa-trash" onclick="deleteTask(${index})" title="Delete" style="transform: translateX(30px);"></i>
            <i class="fas fa-edit" onclick="editTask(${index})" title="Edit"></i>
        </div>
    `).join('');
}

// Delete task function with alert
function deleteTask(index) {
    const taskName = tasks[index].name; // Get the task name for the toast message
    tasks.splice(index, 1); // Remove the task from the array
    renderTasks(); // Re-render tasks
    showToast(`Task "${taskName}" has been deleted`); // Show toast notification
}

// Function to display toast message
function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Set the inner HTML of the toast
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-solid fa-check check"></i>
            <div class="message">
                <span class="text text-1">Done</span>
                <span class="text text-2">${message}</span>
            </div>
        </div>
        <i class="fa-solid fa-xmark close" onclick="closeToast(this)"></i>
        <div class="progress"></div>
    `;
    
    // Append toast to the container
    toastContainer.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Function to close toast manually
function closeToast(toastElement) {
    toastElement.parentElement.remove(); // Remove the toast element
}


// Edit task function
function editTask(index) {
    const task = tasks[index];
    taskNameInput.value = task.name;
    taskDescriptionInput.value = task.description;
    taskDateInput.value = task.date;
    editIndex = index; // Set edit index
}

// Toggle complete task
function toggleComplete(index) {
    const task = tasks[index];
    if (document.getElementById(`task-${index}`).checked) {
        completedTasks.push(task);
        tasks.splice(index, 1);
    } else {
        // Return to uncompleted tasks
        tasks.push(completedTasks[index]);
        completedTasks.splice(index, 1);
    }
    renderTasks();
    renderCompletedTasks();
}

// Render completed tasks function
function renderCompletedTasks() {
    completeContainer.innerHTML = completedTasks.map((task, index) => `
        <div class="task-item">
            <label><strong>${task.name}</strong></label>
            <p>${task.description}</p>
            <p><small>${task.date}</small></p>
            <i class="fas fa-undo" onclick="returnTask(${index})" title="Return" style="transform: translateX(40px);"></i>
            <i class="fas fa-trash" onclick="deleteCompletedTask(${index})" title="Delete"></i>
        </div>
    `).join('');
}

// Return task to uncompleted tasks
function returnTask(index) {
    const task = completedTasks[index];
    tasks.push(task);
    completedTasks.splice(index, 1);
    renderTasks();
    renderCompletedTasks();
}

// Delete completed task function with alert
function deleteCompletedTask(index) {
    const taskName = completedTasks[index].name; // Get the task name for the toast message
    completedTasks.splice(index, 1); // Remove the task from the completed tasks array
    renderCompletedTasks(); // Re-render completed tasks
    showToast(`Task "${taskName}" has been deleted`); // Show toast notification
}
