// Modules to control application life and create native browser window
const { log } = require('console')
const { app, BrowserWindow } = require('electron')
const path = require('path')

app.commandLine.appendSwitch("enable-features", "SharedArrayBuffer");

const isDevEnvironment = process.env.DEV_ENV === 'true'

let mainWindow;

const createWindow = () => {
    
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs')
        }
    })

    // define how electron will load the app
    if (isDevEnvironment) {

        // if your vite app is running on a different port, change it here
        mainWindow.loadURL('http://localhost:5173/');

        // Open the DevTools.
        mainWindow.webContents.on("did-frame-finish-load", () => {
            mainWindow.webContents.openDevTools();
        });

        log('Electron running in dev mode: 🧪')

    } else {
        
        // when not in dev mode, load the build file instead
        mainWindow.loadFile(path.join(__dirname, '../dist', 'index.html'));
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') app.quit()
// })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.