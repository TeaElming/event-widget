/** @format */

import { app, BrowserWindow } from "electron"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import { createRequire } from "module"

// Create require for CommonJS modules (like electron-reload)
const require = createRequire(import.meta.url)

// Create __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Enable live reload during development
try {
	require("electron-reload")(__dirname, {
		electron: require(path.join(__dirname, "node_modules", "electron")),
	})
} catch (err) {
	console.error("Failed to load electron-reload:", err)
}

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true, // allows usage of Node.js APIs in renderer
			contextIsolation: false,
		},
		// Set alwaysOnTop to true if you want the window pinned on top
		alwaysOnTop: false,
	})

	win.loadFile("index.html")
}

app.whenReady().then(() => {
	createWindow()

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on("window-all-closed", () => {
	// On macOS, apps generally remain active until explicitly quit.
	if (process.platform !== "darwin") app.quit()
})
