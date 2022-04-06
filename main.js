const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.maximize();

  win.loadFile('index.html');

  win.show();
}

app.whenReady().then(() => {
  createWindow()
});
