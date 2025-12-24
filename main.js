const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#A6A9E2',
    icon: path.join(__dirname, 'app/assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },

  })

  win.setMenu(null)

  win.loadFile('app/index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
