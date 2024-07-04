const { contextBridge, ipcRenderer } = require('electron');

async function saveAs(
    /** @type {string | undefined} */ defaultPath, 
    /** @type {any} */ data,
    /** @type {() => {}} */ callback
) {
    let result = await ipcRenderer.invoke('save-dialog', defaultPath, data);
    if (!result.canceled) {
        await saveData(result.filePath, data, callback);
    }
    return result;
}

async function saveData(
    /** @type {string} */ filePath, 
    /** @type {any} */ data, 
    /** @type {() => {}} */ callback
) {
    ipcRenderer.once('write-complete', callback);
    ipcRenderer.invoke('write-file', filePath, data);
}

async function openAndRead() {
    let returnValue = {
        completed: false,
        fileContent: "",
        fileName: "",
        filePath: "",
    }
    let results = await ipcRenderer.invoke('open-dialog');
    if (!results.canceled) {
        // Since we're doing an IO operation, may as well let the path jobs do their thing 
        // while we wait
        let fullpath = results.filePaths[0];
        let readTask = ipcRenderer.invoke('read-file', fullpath).then(d => returnValue.fileContent = d);
        let nameTask = basename(fullpath).then(n => returnValue.fileName = n);
        let pathTask = dirname(fullpath).then(p => returnValue.filePath = p);
        await readTask;
        await nameTask;
        await pathTask
        returnValue.completed = true
    }
    return returnValue;
}

/**
 * @param {string} fullpath
 */
async function dirname(fullpath) {
    return await ipcRenderer.invoke('dirname', fullpath);
}

/**
 * @param {string} fullpath
 */
async function basename(fullpath) {
    return await ipcRenderer.invoke('basename', fullpath);
}

/**
 * @param {string[]} args
 */
async function pathJoin(...args) {
    return await ipcRenderer.invoke('join-paths', ...args);
}

const api = {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    dialogs: {
        saveAs: saveAs,
        save: saveData,
        open: openAndRead,
    },
    path: {
        join: pathJoin,
        basename: basename,
        dirname: dirname,
    }
}

contextBridge.exposeInMainWorld('api', api)

exports.api = api;
