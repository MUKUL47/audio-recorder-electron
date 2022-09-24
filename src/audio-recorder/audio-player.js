import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import PauseIcon from "@mui/icons-material/Pause";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import React, { useEffect, useRef, useState } from "react";
class AudioPlayerType {
  static STOPPED = "STOPPED";
  static PLAYING = "PLAYING";
  static PAUSED = "PAUSED";
}
const actionStyle = { fontSize: 35, cursor: "pointer" };
const playbackMap = {
  1: 1.5,
  1.5: 2,
  2: 1,
};
export default function AudioPlayer({
  audio,
  previousTrack,
  nextTrack,
  trackName,
}) {
  const [state, setState] = useState(AudioPlayerType.STOPPED);
  const ref = useRef();
  const [playbackspeed, setPlaybackspeed] = useState(1);
  useEffect(() => {
    if (!ref.current) return;
    startAudio();
  }, [audio]);
  function startAudio() {
    if (!audio) {
      return ref.current.pause?.();
    }
    ref.current.setAttribute("type", "audio/mp3");
    ref.current.src = URL.createObjectURL(
      new Blob([audio], { type: "audio/mp3" })
    );
    ref.current.play?.();
    setState(AudioPlayerType.PLAYING);
    setPlaybackspeed(playbackMap[2]);
  }
  const audioEnded = () => {
    if (nextTrack) {
      nextTrack();
    } else {
      startAudio();
      playPause();
    }
  };
  useEffect(() => {
    ref.current?.addEventListener("ended", audioEnded, false);
    return () => {
      ref.current?.removeEventListener("ended", audioEnded, false);
    };
  }, []);
  function playPause(isPlay) {
    if (isPlay) {
      setState(AudioPlayerType.PLAYING);
      ref.current.play?.();
    } else {
      setState(AudioPlayerType.PAUSED);
      ref.current.pause?.();
    }
  }
  function updatePlayBack() {
    if (!ref.current) return;
    setPlaybackspeed(playbackMap[playbackspeed]);
    ref.current.playbackRate = playbackMap[playbackspeed];
  }
  return (
    <div className="flex gap-5 w-80 items-center rounded-xl p-3 justify-center bg-cyan-200 bg-opacity-20">
      <FastRewindIcon
        style={actionStyle}
        onClick={() => {
          previousTrack?.();
        }}
      />
      {(state === AudioPlayerType.PLAYING && (
        <PauseIcon style={actionStyle} onClick={() => playPause()} />
      )) || (
        <PlayCircleFilledWhiteIcon
          style={actionStyle}
          onClick={() => playPause(true)}
        />
      )}
      <FastForwardIcon
        style={actionStyle}
        onClick={() => {
          nextTrack?.();
        }}
      />
      <strong className="cursor-pointer select-none" onClick={updatePlayBack}>
        {playbackspeed}x
      </strong>
      <div className="hidden">
        <video ref={ref} />
      </div>
    </div>
  );
}
