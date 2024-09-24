const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const updateElectronApp = require('update-electron-app');

console.log('Main process starting');

// Initialize auto-update
updateElectronApp({
  repo: 'ylber-gashi/electron-example', // Format: 'owner/repo'
  updateInterval: '1 hour', // Check for updates every hour
  notifyUser: true, // Notify the user when an update is available
  logger: require('electron-log'), // Optional: Use a logger
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  console.log('Creating main window');
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const tasksFile = path.join(app.getPath('userData'), 'tasks.json');
console.log('Tasks file location:', tasksFile);

ipcMain.handle('getTasks', () => {
  console.log('getTasks handler called');
  if (fs.existsSync(tasksFile)) {
    const data = fs.readFileSync(tasksFile, 'utf-8');
    console.log('Tasks loaded:', data);
    return JSON.parse(data);
  }
  console.log('No tasks file found, returning empty array');
  return [];
});

ipcMain.handle('saveTasks', (event, tasks) => {
  console.log('saveTasks handler called with tasks:', tasks);
  fs.writeFileSync(tasksFile, JSON.stringify(tasks));
  console.log('Tasks saved successfully');
});

console.log('Main process setup complete');
