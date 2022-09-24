let electron = require("electron");
let app = electron.app;
let BrowserWindow = electron.BrowserWindow;
let mainWindow = null;
const fs = require("fs");
app.on("window-all-closed", function () {
  if (process.platform != "darwin") {
    app.quit();
  }
});

app.on("ready", async function () {
  try {
    mainWindow = new BrowserWindow({
      minWidth: 400,
      minHeight: 600,
      transparent: false,
      frame: true,
    });
    mainWindow.loadURL(__dirname + "/build/index.html");
    console.log("file://" + __dirname + "build/index.html");
    mainWindow.on("closed", function () {
      mainWindow = null;
      //   const file = "./frontend/renderKey.js";
      //   if (fs.existsSync(file)) {
      //     fs.unlinkSync(file);
      //   }
    });
  } catch (ee) {
    console.log(ee);
  }
});
