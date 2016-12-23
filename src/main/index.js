const electron = require('electron')

let appWindow

electron.app.on('ready', () => {
    appWindow = new electron.BrowserWindow()
    appWindow.loadURL(/*RENDERER-URL-LOAD*/)
    
    appWindow.on('closed', () => {
        appWindow = null
    })
})
