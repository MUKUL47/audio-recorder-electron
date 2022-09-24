import React, { useEffect, useRef, useState } from "react";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import PauseIcon from "@mui/icons-material/Pause";
class AudioPlayerType {
  static STOPPED = "STOPPED";
  static PLAYING = "PLAYING";
  static PAUSED = "PAUSED";
}
const actionStyle = { fontSize: 35, cursor: "pointer" };
export default function AudioPlayer({ audio, previousTrack, nextTrack }) {
  const [state, setState] = useState(AudioPlayerType.STOPPED);
  const ref = useRef();
  const [playbackspeed, setPlaybackspeed] = useState(1);
  const [currentAudio, setCurrentAudio] = useState(audio);

  useEffect(() => {
    if (!ref.current || !currentAudio) return;
    ref.current.pause?.();
    ref.current.abort?.();
    ref.current.setAttribute("type", "audio/mp3");
    ref.current.src =
      //   "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba-online-audio-converter.com_-1.wav";
      URL.createObjectURL(new Blob([currentAudio], { type: "audio/mp3" }));
    // ref.current.load();
  }, [currentAudio]);
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
    if (playbackspeed === 1) {
      setPlaybackspeed(1.5);
      ref.current.playbackRate = 1.5;
    } else if (playbackspeed === 1.5) {
      setPlaybackspeed(2);
      ref.current.playbackRate = 2;
    } else {
      setPlaybackspeed(1);
      ref.current.playbackRate = 1;
    }
  }
  return (
    <div className="flex gap-5 w-80 items-center rounded-xl p-3 justify-center bg-white bg-opacity-20">
      <FastRewindIcon
        style={actionStyle}
        onClick={() => {
          if (previousTrack) {
            setCurrentAudio(previousTrack());
          }
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
          if (nextTrack) {
            setCurrentAudio(nextTrack());
          }
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
