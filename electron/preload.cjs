const { contextBridge, dialog } = require('electron')

const saveDialog = (defaultPath) => {
    dialog.showSaveDialog({
        defaultPath: defaultPath,
        properties: [
            "createDirectory",
            "dontAddToRecent",
            "showOverwriteConfirmation",
        ],
    })
}

export const api = {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
}

contextBridge.exposeInMainWorld('api', api)