"use client";

import React from "react";
import {
  X,
  Sliders,
  CloudSnow,
  Sparkles,
  RotateCcw,
  SunMedium
} from "lucide-react";
import { SnowSpeedSlider } from "./SnowSpeedSlider";
import { SnowDensitySlider } from "./SnowDensitySlider";
import { useWinterStore } from "../../stores/winter-store";

interface SnowControlPanelProps {
  onClose: () => void;
}

export function SnowControlPanel({ onClose }: SnowControlPanelProps) {
  const {
    snowfallEnabled,
    snowSpeedLevel,
    snowDensity,
    northernLightsEnabled,
    auroraIntensity,
    qualityPreset,
    effectiveQuality,
    snowmanPosition,
    setSnowfallEnabled,
    setSnowSpeedLevel,
    setSnowDensity,
    setNorthernLightsEnabled,
    setAuroraIntensity,
    setQualityPreset,
    resetSnowmanPosition,
    resetDefaults
  } = useWinterStore();

  return (
    <div className="fixed top-16 sm:top-20 right-2 sm:right-6 z-50 w-[310px] max-w-[calc(100vw-1rem)] max-h-[min(540px,calc(100vh-5rem))] overflow-y-auto overscroll-contain bg-[#06101f]/94 backdrop-blur-2xl border border-cyan-300/20 rounded-3xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.75)] text-white pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-300 touch-pan-y">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-[#00FF80] flex items-center justify-center border border-emerald-400/30">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide text-white">Scene Controls</h3>
            <p className="text-[10px] text-cyan-200/70">Tromsø Arctic Experience</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label="Close scene control panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* 1. Aurora Visibility Toggle */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Sparkles className="w-4 h-4 text-[#00FF80]" />
            <span>Northern Lights</span>
          </div>
          <button
            onClick={() => setNorthernLightsEnabled(!northernLightsEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
              northernLightsEnabled ? "bg-[#00D978]" : "bg-slate-700"
            }`}
            role="switch"
            aria-checked={northernLightsEnabled}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                northernLightsEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* 2. Aurora Intensity Slider */}
        <div className={`space-y-1.5 ${!northernLightsEnabled ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-cyan-100 font-medium">
              <SunMedium className="w-3.5 h-3.5 text-[#25E5D1]" />
              <span>Aurora Intensity</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-300 font-bold">
              {Math.round(auroraIntensity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={auroraIntensity}
            onChange={(e) => setAuroraIntensity(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800/80 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            aria-label="Aurora intensity"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(auroraIntensity * 100)}
          />
          <div className="flex justify-between text-[10px] text-cyan-100/60 font-medium px-0.5">
            <span>0% (Off)</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* 3. Snowfall Master Switch */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <CloudSnow className="w-4 h-4 text-sky-400" />
            <span>Falling Snow</span>
          </div>
          <button
            onClick={() => setSnowfallEnabled(!snowfallEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
              snowfallEnabled ? "bg-amber-400" : "bg-slate-700"
            }`}
            role="switch"
            aria-checked={snowfallEnabled}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                snowfallEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* 4. Snow Speed Slider */}
        <SnowSpeedSlider
          level={snowSpeedLevel}
          onChange={setSnowSpeedLevel}
          disabled={!snowfallEnabled}
        />

        {/* 5. Snow Density Slider */}
        <SnowDensitySlider
          density={snowDensity}
          onChange={setSnowDensity}
          disabled={!snowfallEnabled}
        />

        {/* 6. Graphics Quality Presets */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <div className="flex justify-between text-xs text-blue-200">
            <span>Graphics Quality</span>
            <span className="font-mono text-amber-300 uppercase">
              {qualityPreset === "auto" ? `Auto (${effectiveQuality})` : qualityPreset}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {(["auto", "low", "medium", "high"] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQualityPreset(q)}
                className={`py-1.5 rounded-xl text-[10px] font-semibold uppercase transition-all cursor-pointer ${
                  qualityPreset === q
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-400/20"
                    : "bg-white/10 hover:bg-white/15 text-white/80"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* 7. Optional Reset Snowman Position */}
        {snowmanPosition !== null && (
          <button
            onClick={resetSnowmanPosition}
            className="w-full py-2 rounded-2xl flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-cyan-200 hover:text-white border border-cyan-300/20 transition-colors cursor-pointer text-xs font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#25E5D1]" />
            <span>Reset Snowman Position</span>
          </button>
        )}

        {/* 8. Reset Defaults Button */}
        <button
          onClick={resetDefaults}
          className="w-full py-2.5 rounded-2xl flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer text-xs font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
          <span>Reset All Defaults</span>
        </button>
      </div>
    </div>
  );
}

export default SnowControlPanel;
