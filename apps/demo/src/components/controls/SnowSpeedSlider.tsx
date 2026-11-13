"use client";

import React from "react";
import { Gauge } from "lucide-react";
import { SNOW_SPEED_LEVELS } from "nordlys-winter";

interface SnowSpeedSliderProps {
  level: number;
  onChange: (level: number) => void;
  disabled?: boolean;
}

export function SnowSpeedSlider({
  level,
  onChange,
  disabled = false
}: SnowSpeedSliderProps) {
  const currentConfig = SNOW_SPEED_LEVELS[level] || SNOW_SPEED_LEVELS[3];

  return (
    <div className={`space-y-2 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-blue-200 font-medium">
          <Gauge className="w-3.5 h-3.5 text-amber-300" />
          <span>Snowfall Speed</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-[11px] text-blue-300/80">Level {level} / 10</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-semibold border border-amber-400/30">
            {currentConfig.label}
          </span>
        </div>
      </div>

      {/* Slider track */}
      <div className="relative py-1">
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={level}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-800/80 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          aria-label="Snowfall speed level from 1 to 10"
          aria-valuemin={1}
          aria-valuemax={10}
          aria-valuenow={level}
          aria-valuetext={`Level ${level}: ${currentConfig.label}`}
        />
      </div>

      {/* Labels below slider */}
      <div className="flex justify-between text-[10px] text-blue-200/60 font-medium px-0.5">
        <span>Slow (Gentle)</span>
        <span className="hidden sm:inline">Normal</span>
        <span className="text-amber-300/80">Blizzard</span>
      </div>

      {/* Description caption */}
      <p className="text-[11px] text-blue-100/70 italic">
        {currentConfig.description}.
      </p>
    </div>
  );
}

export default SnowSpeedSlider;

