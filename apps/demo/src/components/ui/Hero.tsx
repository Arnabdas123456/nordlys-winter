"use client";

import React from "react";
import { Compass, Music, Disc3 } from "lucide-react";
import { useAudio } from "../audio/AudioProvider";

interface HeroProps {
  onExplore: () => void;
}

export function Hero({ onExplore }: HeroProps) {
  const { togglePlay, isPlaying } = useAudio();

  return (
    <section className="relative w-full pt-14 sm:pt-20 md:pt-24 pb-3 flex flex-col items-center justify-start text-center px-4 sm:px-6 pointer-events-none select-none z-20">
      <div className="max-w-3xl mx-auto flex flex-col items-center space-y-2 sm:space-y-3 pointer-events-none">
        {/* 1. Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06101f]/55 border border-emerald-400/25 text-emerald-200 text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF80] shadow-[0_0_8px_#00FF80]" />
          <span>TROMSØ · ARCTIC NORWAY</span>
        </div>

        {/* 2. Main Heading: "Where Winter Meets the Northern Lights." */}
        <h1 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] leading-tight">
          Where Winter Meets the{" "}
          <span className="bg-gradient-to-r from-emerald-300 via-[#25E5D1] to-cyan-300 bg-clip-text text-transparent">
            Northern Lights.
          </span>
        </h1>

        {/* 3. Description */}
        <p className="text-xs sm:text-sm md:text-[15px] text-slate-100/90 font-normal max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] px-2">
          Under a sky alive with emerald light, let the falling snow and glowing winter village take you somewhere magical.
        </p>

        {/* 4. Supporting Line */}
        <p className="text-[11px] sm:text-xs text-amber-200/95 font-medium tracking-wide max-w-md mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          Slow down. Look up. Experience the magic.
        </p>

        {/* 5. CTA Buttons (Visually balanced, pointer-events enabled) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-1 w-full sm:w-auto pointer-events-auto">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto min-w-[170px] sm:min-w-[190px] flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-95 transition-all cursor-pointer border border-amber-200/50"
          >
            <Compass className="w-4 h-4 text-slate-950" />
            <span>Explore the Experience</span>
          </button>

          <button
            onClick={togglePlay}
            className={`w-full sm:w-auto min-w-[170px] sm:min-w-[190px] flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border transition-all cursor-pointer shadow-lg active:scale-95 ${
              isPlaying
                ? "bg-emerald-950/75 text-emerald-200 border-emerald-400/50 shadow-emerald-500/15 hover:bg-emerald-900/80"
                : "bg-[#071324]/80 hover:bg-[#0d1e38]/90 text-white border-cyan-300/30"
            }`}
          >
            {isPlaying ? (
              <Disc3 className="w-4 h-4 text-emerald-300 animate-spin" style={{ animationDuration: "3s" }} />
            ) : (
              <Music className="w-4 h-4 text-amber-300" />
            )}
            <span>{isPlaying ? "Pause Winter Music" : "Play Winter Music"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
