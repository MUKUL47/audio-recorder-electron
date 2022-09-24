import React from "react";
import ReactDOM from "react-dom/client";
import AudioRecorder from "./audio-recorder/audio-recorder";
import "./index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AudioRecorder />
  </React.StrictMode>
);
