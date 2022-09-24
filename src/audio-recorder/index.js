import React from "react";
import AudioRecorder from "./audio-recorder";
import Player from "./player";
import Tabs from "./tabs";
export default function Audio() {
  return (
    <div className="flex flex-col bg-cyan-800 h-screen w- m-auto">
      <Tabs
        tabs={[
          {
            name: "Record",
            child: <AudioRecorder />,
          },
          {
            name: "View Recordings",
            child: <Player />,
          },
        ]}
      />
    </div>
  );
}
