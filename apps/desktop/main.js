/**
 * LUNA Desktop — Electron 主进程
 *
 * 启动时加载 Web 客户端，提供原生桌面体验。
 * 后续可接入系统托盘、通知、快捷键等桌面特性。
 */
const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 800,
    resizable: true,
    title: 'LUNA · 星光歌姬',
    backgroundColor: '#0f0f23',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // 开发模式加载 localhost，生产模式加载打包文件
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000/gift')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../web/dist/index.html'))
  }

  mainWindow.on('closed', () => { mainWindow = null })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
