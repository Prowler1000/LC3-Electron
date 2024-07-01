const { contextBridge, ipcRenderer } = require('electron');

async function saveAs(
    /** @type {string | undefined} */ defaultPath, 
    /** @type {any} */ data,
    /** @type {() => {}} */ callback,
) {
    let result = await ipcRenderer.invoke('save-dialog', defaultPath, data);
    if (!result.cancelled) {
        ipcRenderer.once('write-complete', callback);
        ipcRenderer.invoke('write-file', result.filePath, data);
    }
    return result;
}

const api = {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    dialogs: {
        saveAs: saveAs,
    },
}

contextBridge.exposeInMainWorld('api', api)

exports.api = api;
