const electron = require('electron')

let appWindow

electron.app.on('ready', () => {
    appWindow = new electron.BrowserWindow()
    appWindow.loadURL(/*RENDERER-URL-LOAD*/)
    
    appWindow.on('closed', () => {
        appWindow = null
    })
})

electron.app.on('window-all-closed', () => {
    electron.app.quit()
})
