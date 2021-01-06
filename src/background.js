'use strict'

import * as net from 'net';
import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import defaultSettings from './static/settings.json';
const JsonSocket = require('json-socket');

const Storage = require('electron-store');
const mainStorage = new Storage({
  defaults: defaultSettings
});
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let debugBarServer;

function startServer() {
  if (debugBarServer) {
    debugBarServer.close();
  }

  debugBarServer = net.createServer();

  debugBarServer.listen(mainStorage.get('port'), '0.0.0.0', () => {
    console.log('TCP Server is running on port ' + mainStorage.get('port'));
  });


  debugBarServer.on('connection', function (sock) {
    sock = new JsonSocket(sock);
    sock.on('message', function (message) {
      BrowserWindow.getAllWindows().map(window => {
        window.webContents.send('request', message);
      });
    });
  });
}

ipcMain.on('restartServer', () => {
  startServer();
})

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 500,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    debugBarServer.close();
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  startServer()

  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        debugBarServer.close();
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      debugBarServer.close();
      app.quit()
    })
  }
}
