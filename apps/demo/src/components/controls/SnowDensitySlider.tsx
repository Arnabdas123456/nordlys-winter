"use client";

import React from "react";
import { Snowflake } from "lucide-react";

interface SnowDensitySliderProps {
  density: number;
  onChange: (density: number) => void;
  disabled?: boolean;
}

export function SnowDensitySlider({
  density,
  onChange,
  disabled = false
}: SnowDensitySliderProps) {
  return (
    <div className={`space-y-2 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-blue-200 font-medium">
          <Snowflake className="w-3.5 h-3.5 text-sky-400" />
          <span>Snow Density</span>
        </div>
        <div className="font-mono text-[11px] text-amber-300">
          <span>{density.toLocaleString()} particles</span>
        </div>
      </div>

      <div className="relative py-1">
        <input
          type="range"
          min="500"
          max="10000"
          step="250"
          value={density}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-800/80 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
          aria-label="Snow particle density"
          aria-valuemin={500}
          aria-valuemax={10000}
          aria-valuenow={density}
        />
      </div>

      <div className="flex justify-between text-[10px] text-blue-200/60 font-medium px-0.5">
        <span>500 (Sparse)</span>
        <span>3,000 (Default)</span>
        <span>10,000 (Dense)</span>
      </div>
    </div>
  );
}

export default SnowDensitySlider;

