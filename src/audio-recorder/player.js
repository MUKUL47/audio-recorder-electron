import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import AudioPlayer from "./audio-player";
import MyRecordings from "./my-recordings";

export default function Player() {
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [track, setTrack] = useState(null);
  const [audio, setAudio] = useState(null);
  //https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };
  useEffect(() => {
    ipcRenderer.on("GOT_FILE", gotFile);
    return () => {
      ipcRenderer.off("GOT_FILE", gotFile);
    };
  }, []);
  useEffect(() => {
    if (!track || !track.path) {
      return setAudio(null);
    }
    ipcRenderer.send("GET_FILE", track.path);
  }, [track]);

  function gotFile(e, file) {
    setAudio(b64toBlob(file));
  }
  return (
    <div className="flex items-center h-full">
      <div className="w-72 bg-cyan-200 rounded-lg p-2">
        <MyRecordings
          nextFile={next}
          prevFile={prev}
          onSelectFile={(file) => {
            const { name, path } = file || {};
            setTrack({ name, path });
          }}
        />
      </div>
      <div className="flex-1 flex justify-center flex-col items-center gap-2">
        {track?.name && <strong>{track.name}</strong>}
        <AudioPlayer
          audio={audio}
          previousTrack={() => {
            setPrev(Math.random());
          }}
          nextTrack={() => {
            setNext(Math.random());
          }}
        />
      </div>
    </div>
  );
}
