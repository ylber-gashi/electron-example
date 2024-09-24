let tasks = [];

const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

console.log('Renderer script loaded');

function renderTasks() {
  console.log('Rendering tasks:', tasks);
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-task');
    deleteButton.onclick = () => deleteTask(index);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
}

function addTask() {
  console.log('Add task button clicked');
  const newTask = taskInput.value.trim();
  if (newTask) {
    console.log('Adding new task:', newTask);
    tasks.push(newTask);
    taskInput.value = '';
    renderTasks();
    window.electronAPI.saveTasks(tasks)
      .then(() => console.log('Tasks saved successfully'))
      .catch(error => console.error('Error saving tasks:', error));
  }
}

function deleteTask(index) {
  console.log('Deleting task at index:', index);
  tasks.splice(index, 1);
  renderTasks();
  window.electronAPI.saveTasks(tasks)
    .then(() => console.log('Tasks saved successfully after deletion'))
    .catch(error => console.error('Error saving tasks after deletion:', error));
}

console.log('Adding event listeners');
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

console.log('Fetching initial tasks');
window.electronAPI.getTasks()
  .then((savedTasks) => {
    console.log('Received saved tasks:', savedTasks);
    tasks = savedTasks;
    renderTasks();
  })
  .catch(error => console.error('Error getting tasks:', error));

// Function to display version
function displayVersion() {
  window.electronAPI.getAppVersion()
    .then(version => {
      const versionElement = document.getElementById('app-version');
      versionElement.textContent = `Version: ${version}`;
    })
    .catch(error => console.error('Error fetching app version:', error));
}

// Call displayVersion after fetching initial tasks
window.electronAPI.getTasks()
  .then((savedTasks) => {
    console.log('Received saved tasks:', savedTasks);
    tasks = savedTasks;
    renderTasks();
    displayVersion(); // Display version after tasks are loaded
  })
  .catch(error => console.error('Error getting tasks:', error));