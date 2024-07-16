import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { testMaa } from './MaaFw/init'
import * as maa from '@nekosu/maa-node'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  const mainWindowMessage = (msg: string) => mainWindow.webContents.send('message-alerts', msg)
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  return { mainWindowMessage }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const { mainWindowMessage } = createWindow()
  let Instance: maa.Instance | undefined = undefined

  // IPC test
  ipcMain.on('ping', () => {
    console.log('pong')
    mainWindowMessage('start pong')
  })
  ipcMain.on('start', () => {
    dialog.showErrorBox('startMaaIPC', 'start !!!!')
    // testMaa()
  })
  ipcMain.on('initMaaFw', async () => {
    if (Instance != undefined) {
      return
    }
    const result = await testMaa(mainWindowMessage)
    if (result !== undefined) {
      Instance = result
    }
  })
  ipcMain.handle('test', async (_event, data) => {
    if (Instance === undefined) {
      return
    }
    const taskName = JSON.parse(data).type
    switch (taskName) {
      case 'test1':
        // dialog.showErrorBox('testIPC', 'type:test1')
        mainWindowMessage('start test1')
        return 'OK'
      case 'test2': {
        mainWindowMessage(`start ${taskName}`)
        const b = await Instance.post_task('Task1').wait()
        console.log(b)
        if (b == 3000) {
          mainWindowMessage(`Completed: ${taskName}`)
        } else {
          mainWindowMessage(`Fail: ${taskName}`)
        }
        return 'ok'
      }
      case 'startzzz': {
        mainWindowMessage(`start ${taskName}`)
        const b = await Instance.post_task('StartUp_ZZZ').wait()
        console.log(b)
        if (b == 3000) {
          mainWindowMessage(`Completed: ${taskName}`)
        } else {
          mainWindowMessage(`Fail: ${taskName}`)
        }
        return 'ok'
      }
      default:
        return 'FALSE'
    }
  })

  // createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
