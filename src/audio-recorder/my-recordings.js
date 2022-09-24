import DeleteIcon from "@mui/icons-material/Delete";
import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
export default function MyRecordings({ onSelectFile, nextFile, prevFile }) {
  const [directoryFiles, setDirectoryFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    nextFile && nextPrev(true);
  }, [nextFile]);
  useEffect(() => {
    prevFile && nextPrev();
  }, [prevFile]);
  function fetchRecordings() {
    const { path, files } = ipcRenderer.sendSync("GET_FILES");
    initializeFiles({ files, path });
  }
  function fetchDirectory() {
    const { files, path } = ipcRenderer.sendSync("GET_DIRECTORY_AUDIO");
    initializeFiles({ files, path });
  }
  function initializeFiles({ path = "", files = [] }) {
    setDirectoryFiles(files);
    if (files.length === 0) {
      setSelectedFile(null);
      onSelectFile?.(null);
      return;
    }
    setSelectedFile(files[0].path);
    onSelectFile?.(files[0]);
  }
  function onFileSelect({ name, path }) {
    setSelectedFile(path);
    onSelectFile?.({ name, path });
  }
  function nextPrev(isNext) {
    let index = directoryFiles.findIndex((v) => v?.path === selectedFile);
    if (isNext) {
      index =
        index == -1 || index === directoryFiles.length - 1 ? 0 : index + 1;
    } else {
      index = index == -1 || index === 0 ? 0 : index - 1;
    }
    setSelectedFile(directoryFiles?.[index]?.path);
    onSelectFile?.(directoryFiles?.[index]);
  }
  function deleteFile(path) {
    ipcRenderer.sendSync("FILE_DELETE", path);
    let index = directoryFiles.findIndex((v) => path === selectedFile);
    if (index > -1) {
      nextPrev(true);
    }
    setDirectoryFiles(directoryFiles.filter((v) => v.path !== path));
  }
  return (
    <div
      className="flex flex-col gap-1 m-2 h-full"
      style={{
        height: "calc(100vh - 200px)",
      }}>
      <button
        onClick={fetchDirectory}
        className="bg-black p-3 px-4 rounded-md text-white">
        Select Folder
      </button>
      <button
        className="bg-black p-3 px-4 rounded-md text-white"
        onClick={fetchRecordings}>
        Select Recordings
      </button>
      {/* {directory && <p className="text-black text-center">{directory}</p>} */}
      <div className=" overflow-auto">
        {directoryFiles.map(({ name, path }) => {
          return (
            <p
              className={`m-1 p-2 border  border-gray-700 rounded-md   hover:bg-blue-800 hover:text-white ${
                selectedFile === path && "bg-blue-900 text-white"
              }`}
              onClick={() => onFileSelect({ name, path })}>
              <div className="flex justify-between" title={path}>
                <p className="cursor-pointer">{name}</p>
                <DeleteIcon
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(path);
                  }}
                />
              </div>
            </p>
          );
        })}
      </div>
    </div>
  );
}
