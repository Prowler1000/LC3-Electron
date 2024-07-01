// Modules to control application life and create native browser window
const { log } = require('console')
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

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
        const electron = require('electron')
        let displays = electron.screen.getAllDisplays()
        let externalDisplay = displays.find((display) => {
            return display.bounds.x !== 0 || display.bounds.y !== 0
        })
        if (externalDisplay) {
            mainWindow.setPosition(externalDisplay.bounds.x, externalDisplay.bounds.y);
            mainWindow.maximize();
        }
        // if your vite app is running on a different port, change it here
        mainWindow.loadURL('http://localhost:5173/');

        // Open the DevTools.
        mainWindow.webContents.on("did-frame-finish-load", () => {
            //mainWindow.webContents.openDevTools();
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

const saveDialog = async (event, ...args) => {
    return dialog.showSaveDialog(mainWindow,
    {
        defaultPath: args[0] === undefined ? args[0] : '',
        properties: [
            "createDirectory",
            "dontAddToRecent",
            "showOverwriteConfirmation",
        ],
    });
}

const writeFile = (event, ...args) => {
    fs.writeFile(args[0], args[1], () => event.sender.send('write-complete'))
}

const dirname = (event, ...args) => {
    return path.dirname(args[0]);
}

const basename = (event, ...args) => {
    return path.basename(args[0]);
}

const joinPaths = (event, ...args) => {
    return path.join(...args);
}

let listeners = {

}

let invokeables = {
    'save-dialog': saveDialog,
    'write-file': writeFile,
    'join-paths': joinPaths,
    'basename': basename,
    'dirname': dirname,
}

function registerListeners() {
    Object.entries(listeners).forEach(([channel, handler]) => {
        ipcMain.on(channel, handler);
    });
    Object.entries(invokeables).forEach(([channel, handler]) => {
        ipcMain.handle(channel, handler);
    });
}

app.whenReady().then(registerListeners());