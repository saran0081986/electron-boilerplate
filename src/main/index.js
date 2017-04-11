import electron from 'electron'

let appWindow

electron.app.on('ready', () => {
  // eslint-disable-next-line
  /*INJECT-DEVTOOLS-INSTALLER*/

  appWindow = new electron.BrowserWindow()
  appWindow.loadURL(/*INJECT-RENDERER-URL*/)

  appWindow.on('closed', () => {
    appWindow = null
  })
})

electron.app.on('window-all-closed', () => {
  electron.app.quit()
})
