const { contextBridge, ipcRenderer } = require('electron');
const { app } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getTasks: () => {
    console.log('getTasks called from renderer');
    return ipcRenderer.invoke('getTasks');
  },
  saveTasks: (tasks) => {
    console.log('saveTasks called from renderer with tasks:', tasks);
    return ipcRenderer.invoke('saveTasks', tasks);
  },
  getAppVersion: () => {
    return ipcRenderer.invoke('get-app-version');
  }
});

console.log('electronAPI exposed to renderer');
