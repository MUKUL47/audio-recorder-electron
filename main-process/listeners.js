const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  ipcRenderer,
} = require("electron");
const fs = require("fs");
const path = require("path");
class IpcListeners {
  constructor(browserWindow) {
    this.browserWindow = browserWindow;
    ipcMain.on("GET_DIRECTORY_AUDIO", this.getDirectory);
    ipcMain.on("GET_FILE", this.getFile);
    ipcMain.on("FILE_DELETE", this.deleteFile);
    ipcMain.on("SAVE_FILE", this.saveFile);
    ipcMain.on("GET_FILES", this.getFiles);
  }

  b64ToBufferArray(base64) {
    return Buffer.from(base64, "base64"); //.toString("binary");
  }

  getFiles = async (e) => {
    const { filePaths } = await dialog.showOpenDialog(this.browserWindow, {
      properties: ["multiSelections"],
      filters: [{ name: "Recordings", extensions: ["mp3"] }],
    });
    e.returnValue = {
      path: "Selected Recordings",
      files: filePaths.map((file) => {
        return { path: file, name: path.basename(file) };
      }),
    };
  };
  saveFile = async (e, { b64, separator, fileName, url }) => {
    const { filePaths } = await dialog.showOpenDialog(this.browserWindow, {
      properties: ["openDirectory"],
      filters: [{ name: "All Files", extensions: ["*"] }],
    });
    if (typeof filePaths?.[0] === "string") {
      fs.writeFile(
        path.join(filePaths?.[0], `${fileName}.mp3`),
        this.b64ToBufferArray(b64.replace(separator, "")),
        (err) => {
          if (!err) {
            dialog.showMessageBoxSync(this.browserWindow, {
              type: "info",
              message: "Saved successfully",
            });
            e.sender.send("SAVED_FILE");
          }
        }
      );
    }
  };

  deleteFile = (e, path) => {
    fs.unlink(path, () => {
      dialog.showMessageBoxSync(this.browserWindow, {
        type: "info",
        message: "Recording deleted successfully",
      });
      e.returnValue = true;
    });
  };

  getFile = (e, path) => {
    fs.readFile(path, { encoding: "base64" }, (err, data) => {
      e.sender.send("GOT_FILE", data);
    });
  };

  getDirectory = async (e) => {
    const { filePaths } = await dialog.showOpenDialog(this.browserWindow, {
      properties: ["openDirectory"],
      filters: [{ name: "All Files", extensions: ["*"] }],
    });
    if (!filePaths[0]) {
      e.returnValue = { path: "", files: [] };
      return;
    }
    const files = fs.readdirSync(filePaths[0]);
    const filteredFiles = [];
    files.forEach((file) => {
      if (path.extname(file) === ".mp3") {
        filteredFiles.push({
          path: path.join(filePaths[0], file),
          name: file,
        });
      }
    });
    e.returnValue = { path: filePaths[0], files: filteredFiles };
  };
}
module.exports = IpcListeners;
