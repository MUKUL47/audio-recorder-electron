import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { ipcRenderer } from "electron";
import React, { useEffect, useRef, useState } from "react";
import AudioPlayer from "./audio-player";
import useRecorder from "./recorder";
export default function AudioRecorder() {
  const { start, stop, pause, resume, isRecording, isPaused, isInactive } =
    useRecorder();
  const [timer, setTimer] = useState(-1);
  const [paused, setPaused] = useState(true);
  const isRecord = isRecording();
  const isInvalid = isInactive();
  const timerId = useRef({});
  const [newRecording, setNewRecording] = useState(null);
  const [fileName, setFileName] = useState("");
  useEffect(() => {
    if (timer > -1 && !paused) {
      timerId.current = setTimeout(() => {
        setTimer(timer + 1);
      }, 1000);
    }
    return () => {
      clearTimeout(timerId?.current);
    };
  }, [timer, paused]);
  useEffect(() => {
    ipcRenderer.on("SAVED_FILE", onFileSave);
    return () => {
      ipcRenderer.off("SAVED_FILE", onFileSave);
    };
  }, []);
  const toggleRecording = async () => {
    if (isInvalid) {
      start();
      setPaused(!paused);
      setTimer(0);
      setNewRecording(null);
    } else {
      setTimer(-1);
      setPaused(true);
      setNewRecording(await stop());
      setFileName(`my-audio-${Date.now()}`);
    }
  };

  const blobToB64 = (blob) => {
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.readAsDataURL(blob);
    });
  };

  const onFileSave = () => {
    setNewRecording(null);
  };

  const toggleSaveRecording = async (answer) => {
    if (!answer) return setNewRecording(null);
    if (fileName.trim().length === 0) return;
    const separator = "data:audio/mp3;base64,";
    ipcRenderer.send("SAVE_FILE", {
      b64: await blobToB64(new Blob([newRecording], { type: "audio/mp3" })),
      separator,
      fileName,
    });
  };
  return (
    <div className="flex flex-col gap-5 m-3 h-full">
      <div className="flex flex-col gap-5 items-center justify-center">
        <KeyboardVoiceIcon style={{ fontSize: 150, color: "#FFF" }} />
        {timer > -1 && (
          <div className="text-3xl text-white">{getDaysHourSeconds(timer)}</div>
        )}
        {isRecord && (
          <PauseCircleIcon
            style={{ fontSize: 100, color: "#FFF" }}
            onClick={() => {
              pause();
              setPaused(!paused);
            }}
          />
        )}
        {!isRecord && timer > -1 && (
          <PlayArrowIcon
            style={{ fontSize: 100, color: "#FFF" }}
            onClick={() => {
              resume();
              clearInterval(timerId?.current);
              setPaused(!paused);
            }}
          />
        )}
        <div className="flex gap-2">
          {(newRecording && (
            <div className="flex flex-col items-center gap-5">
              <p className="text-3xl mb-5">Recording Completed</p>
              <AudioPlayer audio={newRecording} />
              <div className="flex gap-2 flex-col">
                <input
                  type="text"
                  className="flex-1 py-2 p-1 text-black rounded-sm"
                  placeholder="Enter file name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSaveRecording(true)}
                    className="p-3 w-44 rounded-md bg-green-700 text-white font-sans cursor-pointer text-xl px-5">
                    Save Recording
                  </button>

                  <button
                    onClick={() => toggleSaveRecording(false)}
                    className="p-3 w-44 rounded-md bg-red-700 text-white font-sans cursor-pointer text-xl px-5">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )) || (
            <button
              className="p-3 rounded-md bg-black text-white font-sans cursor-pointer text-xl px-5"
              onClick={toggleRecording}>
              {(!isInvalid && "Stop Recording") || "Start Recording"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
//https://github.com/MUKUL47/Quizzer/blob/main/client/src/shared/utils.ts#L16
function getDaysHourSeconds(seconds) {
  const totalSeconds = Number(seconds) % 60;
  const minutes = Math.floor(Number(seconds) / 60);
  const hours = Math.floor(minutes / 60);
  const h = hours % 24;
  return `${format(h)}:${format(minutes)}:${format(totalSeconds)}`;
}
function format(h) {
  return `${h}`.length === 1 ? `0${h}` : h;
}
