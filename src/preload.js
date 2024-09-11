const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script running');

contextBridge.exposeInMainWorld('electronAPI', {
  getTasks: () => {
    console.log('getTasks called from renderer');
    return ipcRenderer.invoke('getTasks');
  },
  saveTasks: (tasks) => {
    console.log('saveTasks called from renderer with tasks:', tasks);
    return ipcRenderer.invoke('saveTasks', tasks);
  },
});

console.log('electronAPI exposed to renderer');