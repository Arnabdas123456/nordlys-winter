"use client";

import React from "react";
import { Volume2, VolumeX, Play, Pause, Repeat, AlertCircle, Music2, ChevronDown } from "lucide-react";
import { useAudio } from "./AudioProvider";

interface AudioControlsProps {
  onClose?: () => void;
}

export function AudioControls({ onClose }: AudioControlsProps) {
  const {
    isPlaying,
    volume,
    isMuted,
    isLooping,
    isLoaded,
    hasError,
    errorMessage,
    duration,
    currentTime,
    title,
    artist,
    togglePlay,
    setVolume,
    toggleMute,
    toggleLoop,
    seek
  } = useAudio();

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || !seek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(ratio * duration);
  };

  return (
    <div className="relative flex flex-col gap-2.5 p-3.5 bg-slate-950/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-white w-[260px]">
      {/* Top Bar with Title, Play Button, and Minimize */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
            <Music2 className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-wide truncate max-w-[110px]">
              {title || "Snowman"}
            </span>
            <span className="text-[10px] text-amber-200/80 font-medium truncate max-w-[110px]">
              {artist || "Sia"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            title={isPlaying ? "Pause music" : "Play Snowman by Sia"}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Minimize / Close */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Minimize player"
              aria-label="Minimize"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Functional Interactive Progress Bar (Strictly No Timestamps) */}
      {duration > 0 && (
        <div
          onClick={handleSeek}
          className="w-full h-1.5 bg-white/10 hover:bg-white/20 rounded-full overflow-hidden cursor-pointer flex items-center transition-colors my-0.5"
          title="Click to seek"
        >
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-150 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%` }}
          />
        </div>
      )}

      {/* Volume slider, Mute & Loop controls */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/10">
        <button
          onClick={toggleMute}
          className="text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-3.5 h-3.5 text-red-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-sky-300" />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
          aria-label="Volume slider"
        />

        <button
          onClick={toggleLoop}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${
            isLooping ? "text-amber-300 bg-amber-400/20" : "text-white/50 hover:text-white"
          }`}
          title={isLooping ? "Looping enabled" : "Looping disabled"}
          aria-label="Toggle loop"
        >
          <Repeat className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Loading & Status feedback */}
      {!isLoaded && !hasError && (
        <span className="text-[10px] text-amber-200/70 text-center animate-pulse">
          Loading audio...
        </span>
      )}

      {/* Error state */}
      {hasError && errorMessage && (
        <div className="p-2 bg-red-950/70 border border-red-500/30 rounded-xl text-[11px] text-red-200 flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

export default AudioControls;
