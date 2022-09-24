const electron = require("electron");
const path = require("path");
const url = require("url");
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;
const fs = require("fs");
const IpcListeners = require("./listeners");
app.on("window-all-closed", function () {
  if (process.platform != "darwin") {
    app.quit();
  }
});

app.on("ready", async function () {
  try {
    mainWindow = new BrowserWindow({
      width: 800,
      // maxHeight: 1024,
      height: 800,
      transparent: false,
      frame: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    });
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "build", "index.html"),
        protocol: "file",
        slashes: true,
      })
    );
    // mainWindow.loadURL(__dirname + "/build/index.html");
    mainWindow.on("closed", function () {
      mainWindow = null;
    });
    new IpcListeners(mainWindow);
  } catch (ee) {
    console.log(ee);
  }
});
