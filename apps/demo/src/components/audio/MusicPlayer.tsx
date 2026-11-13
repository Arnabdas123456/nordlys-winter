"use client";

import React, { useState } from "react";
import { Disc3, Play, Pause, ChevronUp } from "lucide-react";
import { AudioControls } from "./AudioControls";
import { useAudio } from "./AudioProvider";

export function MusicPlayer() {
  const [expanded, setExpanded] = useState(false);
  const { isPlaying, togglePlay, title, artist } = useAudio();

  return (
    <div className="fixed bottom-14 right-4 lg:bottom-6 lg:right-6 z-40 pointer-events-auto">
      {expanded ? (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <AudioControls onClose={() => setExpanded(false)} />
        </div>
      ) : (
        /* Single Compact Floating Music Widget */
        <div className="flex items-center gap-3 pl-3.5 pr-2 py-2 rounded-full bg-slate-950/85 backdrop-blur-2xl border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.6)] text-white hover:border-amber-400/40 transition-all duration-300">
          {/* Rotating Disc */}
          <div
            onClick={() => setExpanded(true)}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            title="Click to open player settings"
          >
            <Disc3
              className={`w-5 h-5 text-amber-400 transition-transform ${
                isPlaying ? "animate-spin" : "group-hover:rotate-45"
              }`}
              style={{ animationDuration: "3s" }}
            />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white tracking-wide truncate max-w-[110px]">
                {title || "Snowman"}
              </span>
              <span className="text-[10px] text-amber-200/80 font-medium truncate max-w-[110px]">
                {artist || "Sia"}
              </span>
            </div>
          </div>

          {/* Quick Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer ml-1"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Expand Toggle */}
          <button
            onClick={() => setExpanded(true)}
            className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Expand music player"
            aria-label="Expand player"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;
