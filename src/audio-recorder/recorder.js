import { useEffect, useRef, useState } from "react";

export default function useRecorder() {
  const [blobData, setBlobData] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [beingCaptured, setBeingCaptured] = useState(false);
  let onStop = useRef(null);

  const pushAudioData = ({ data }) => {
    setBlobData([...blobData, data]);
    const { resolve, mime } = onStop?.current || {};
    if (resolve && mime) {
      resolve(new Blob([...blobData, data], { type: mime }));
      initialize();
    }
  };
  /**
   *
   *initialize => start => pause <=> resume => stop => GET_DATA => initialize
   */

  useEffect(() => {
    initialize();
  }, []);
  function initialize() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      return Promise.reject(
        new Error(
          "mediaDevices API or getUserMedia method is not supported in this browser."
        )
      );
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        setBeingCaptured(stream);
        const media = new MediaRecorder(stream);
        setMediaRecorder(media);
        media.addEventListener("dataavailable", pushAudioData);
        //   this.mediaRecorder.start();
      });
    }
  }
  function getStatus() {
    return mediaRecorder?.state;
  }
  function isRecording() {
    return mediaRecorder?.state === "recording";
  }
  function isPaused() {
    return mediaRecorder?.state === "paused";
  }
  function isInactive() {
    return mediaRecorder?.state === "inactive";
  }
  const resetRecordingProperties = () => {
    setMediaRecorder(null);
    setBeingCaptured(null);
    setBlobData([]);
  };

  const stopStream = () => {
    beingCaptured?.getTracks?.().forEach((track) => track.stop());
  };
  const start = () => {
    if (isRecording() || isPaused()) return;
    mediaRecorder?.start?.();
  };
  const pause = () => {
    if (isInactive()) return;
    mediaRecorder?.pause?.();
  };
  const resume = () => {
    if (isInactive() || isRecording()) return;
    mediaRecorder?.resume?.();
  };
  const cancel = () => {
    mediaRecorder?.stop?.();
    stopStream();
    resetRecordingProperties();
  };
  const stop = () => {
    return new Promise((resolve) => {
      if (isInactive() || !mediaRecorder) return;
      onStop.current = { resolve, mime: mediaRecorder.mimeType };
      cancel();
    });
  };
  const reset = () => {
    resetRecordingProperties();
    initialize();
  };

  return { start, stop, pause, resume, isRecording, isPaused, isInactive };
}
