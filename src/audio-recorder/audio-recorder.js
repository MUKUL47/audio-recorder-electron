import React, { useEffect, useRef, useState } from "react";
import useRecorder from "./recorder";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AudioPlayer from "./audio-player";
export default function AudioRecorder() {
  const { start, stop, pause, resume, isRecording, isPaused, isInactive } =
    useRecorder();
  const [timer, setTimer] = useState(-1);
  const [paused, setPaused] = useState(true);
  const isRecord = isRecording();
  const isInvalid = isInactive();
  const timerId = useRef({});
  const [newRecording, setNewRecording] = useState(null);
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
    }
  };

  const toggleSaveRecording = async (answer) => {
    if (!answer) return setNewRecording(null);
  };
  return (
    <div className="flex flex-col gap-5 m-3">
      <div className="flex flex-col gap-5 items-center">
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
              {/* <audio controls>
                <source
                  src={URL.createObjectURL(
                    new Blob([newRecording], { type: "audio/mp3" })
                  )}
                />
              </audio> */}
              <AudioPlayer audio={newRecording} />
              <div className="flex gap-2">
                <button
                  onClick={() => toggleSaveRecording(true)}
                  className="p-3 w-44 rounded-md bg-green-700 text-white font-sans cursor-pointer text-xl px-5"
                >
                  Save Recording
                </button>

                <button
                  onClick={() => toggleSaveRecording(false)}
                  className="p-3 w-44 rounded-md bg-red-700 text-white font-sans cursor-pointer text-xl px-5"
                >
                  Cancel
                </button>
              </div>
            </div>
          )) || (
            <button
              className="p-3 rounded-md bg-black text-white font-sans cursor-pointer text-xl px-5"
              onClick={toggleRecording}
            >
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
