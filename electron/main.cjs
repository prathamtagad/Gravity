const { app, BrowserWindow } = require('electron')
const path = require('path')
const http = require('http')
const handler = require('serve-handler')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow
let localServer

// Function to start a local static server for production builds
const startLocalServer = () => {
  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      return handler(request, response, {
        public: path.join(__dirname, '../dist'),
        rewrites: [
          { source: '**', destination: '/index.html' }
        ]
      })
    })
    
    // Listen on a random free port (0)
    server.listen(0, () => {
      const port = server.address().port
      console.log(`Local server running at http://localhost:${port}`)
      resolve({ server, port })
    })

    server.on('error', (err) => {
      reject(err)
    })
  })
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, '../public/icon.png'),
    titleBarStyle: 'default',
    autoHideMenuBar: true,
    show: false,
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    try {
      if (!localServer) {
        const { server, port } = await startLocalServer()
        localServer = server
        mainWindow.loadURL(`http://localhost:${port}`)
      } else {
         const port = localServer.address().port
         mainWindow.loadURL(`http://localhost:${port}`)
      }
    } catch (error) {
      console.error('Failed to start local server:', error)
      // Fallback (might fail auth, but loads UI)
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (localServer) {
    localServer.close()
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    // Open external links in default browser
    if (navigationUrl.startsWith('http')) {
      event.preventDefault()
      require('electron').shell.openExternal(navigationUrl)
    }
  })
})
