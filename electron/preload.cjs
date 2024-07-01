const { contextBridge, ipcRenderer } = require('electron');

async function saveAs(
    /** @type {string | undefined} */ defaultPath, 
    /** @type {any} */ data,
    /** @type {() => {}} */ callback
) {
    let result = await ipcRenderer.invoke('save-dialog', defaultPath, data);
    if (!result.cancelled) {
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
    },
    path: {
        join: pathJoin,
        basename: basename,
        dirname: dirname,
    }
}

contextBridge.exposeInMainWorld('api', api)

exports.api = api;
