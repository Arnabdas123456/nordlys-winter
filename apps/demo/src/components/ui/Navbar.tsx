"use client";

import React, { useState, useEffect } from "react";
import { Snowflake, Sparkles, Music, Disc3 } from "lucide-react";
import { useAudio } from "../audio/AudioProvider";

interface NavbarProps {
  onToggleControls: () => void;
  controlsOpen: boolean;
}

export function Navbar({ onToggleControls, controlsOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { isPlaying, togglePlay } = useAudio();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-auto ${
        scrolled
          ? "glass-nav py-3 px-4 sm:py-3.5 sm:px-6 shadow-2xl"
          : "bg-gradient-to-b from-[#06101f]/85 to-transparent py-4 px-4 sm:py-5 sm:px-6"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Snowflake Logo + Nordlys */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#00D978] via-[#25E5D1] to-[#7555D9] flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Snowflake className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <span className="font-extrabold text-base sm:text-xl tracking-wider text-white whitespace-nowrap">
            Nordlys
          </span>
        </div>

        {/* Right: Home, Scene Controls, Music Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Home Link */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:block"
          >
            Home
          </button>

          {/* Scene Controls Toggle */}
          <button
            onClick={onToggleControls}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold backdrop-blur-xl border transition-all cursor-pointer shadow-lg ${
              controlsOpen
                ? "bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/30 font-bold"
                : "bg-[#06101f]/60 hover:bg-white/15 border-cyan-300/20 text-white"
            }`}
            aria-label="Toggle Winter Scene Controls"
          >
            <Sparkles className={`w-3.5 h-3.5 ${controlsOpen ? "text-slate-950" : "text-[#00FF80]"}`} />
            <span className="hidden sm:inline">Scene</span>
            <span>Controls</span>
          </button>

          {/* Music Toggle */}
          <button
            onClick={togglePlay}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold backdrop-blur-xl border transition-all cursor-pointer shadow-lg ${
              isPlaying
                ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40 shadow-emerald-500/20"
                : "bg-[#06101f]/60 hover:bg-white/15 border-white/20 text-white"
            }`}
            title={isPlaying ? "Pause Winter Music" : "Play Winter Music"}
            aria-label="Music toggle"
          >
            {isPlaying ? (
              <Disc3 className="w-4 h-4 text-emerald-300 animate-spin" style={{ animationDuration: "3s" }} />
            ) : (
              <Music className="w-4 h-4 text-amber-300" />
            )}
            <span className="hidden sm:inline">{isPlaying ? "Pause Music" : "Play Music"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
