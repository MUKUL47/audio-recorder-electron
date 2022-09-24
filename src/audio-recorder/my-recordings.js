import React from "react";

export default function MyRecordings() {
  return (
    <div className="flex flex-wrap gap-1 m-2 h-40 overflow-auto">
      {Array(43)
        .fill("my-voice.wav")
        .map((v) => {
          return (
            <p className="flex-1 h-15 m-1 p-2 border border-black rounded-md cursor-pointer border-opacity-20 text-slate-900 hover:bg-blue-800 hover:text-white">
              {v}
            </p>
          );
        })}
    </div>
  );
}
