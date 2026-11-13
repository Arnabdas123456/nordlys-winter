"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { Snowflake } from "lucide-react";
import { useProgress } from "@react-three/drei";

interface LoadingScreenProps {
  isSceneReady?: boolean;
  onFadeComplete?: () => void;
}

// Deterministic snowflake particle data to avoid SSR hydration mismatches
const SNOW_PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const seed = (i * 137.508) % 100;
  const size = 3 + (i % 4) * 1.5;
  const duration = 6 + (i % 5) * 2.2;
  const delay = -(i * 0.45);
  const opacity = 0.25 + (i % 5) * 0.12;
  return { id: i, left: `${seed}%`, size, duration, delay, opacity };
});

function getStatusMessage(item: string, progress: number, isReady: boolean, bgLoaded: boolean): string {
  if (isReady && progress >= 100) return "Entering Tromsø Night Sky...";
  if (item && item.includes("snowman.glb")) {
    return "Preparing Winter Companion...";
  }
  if (!bgLoaded) return "Setting Arctic Horizon...";
  if (progress > 75) return "Awakening Northern Lights...";
  if (progress > 35) return "Preparing Winter Landscape...";
  return "Initializing Arctic Sky...";
}

export function LoadingScreen({
  isSceneReady = false,
  onFadeComplete
}: LoadingScreenProps) {
  const { active, progress: dreiProgress, item, total, errors } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [bgImageReady, setBgImageReady] = useState(false);
  const [safetyReady, setSafetyReady] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [readyToFade, setReadyToFade] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const targetProgressRef = useRef(0);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Preload critical background image without blocking indefinitely
  useEffect(() => {
    if (typeof window === "undefined") return;
    let mounted = true;
    const img = new Image();
    img.src = "/images/lapland-winter-cabin.jpg";

    const markReady = () => {
      if (mounted) setBgImageReady(true);
    };

    if (img.complete) {
      markReady();
    } else {
      img.onload = markReady;
      img.onerror = markReady;
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Safety timeout fallback (ensures loading screen never hangs indefinitely if an asset stalls)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSafetyReady(true);
    }, 7500);
    return () => window.clearTimeout(timer);
  }, []);

  // Log any asset loading errors gracefully without crashing
  useEffect(() => {
    if (errors && errors.length > 0) {
      console.warn("Nordlys asset notice (fallback ready):", errors);
    }
  }, [errors]);

  // Calculate real target progress
  const effectiveSceneReady = (isSceneReady && bgImageReady && !active) || safetyReady;

  useEffect(() => {
    if (effectiveSceneReady) {
      targetProgressRef.current = 100;
      return;
    }

    if (total === 0) {
      const base = bgImageReady ? 22 : 10;
      targetProgressRef.current = Math.max(targetProgressRef.current, base);
      return;
    }

    const realPct = Math.min(96, Math.max(15, Math.round(dreiProgress * 0.86 + (bgImageReady ? 10 : 0))));
    targetProgressRef.current = Math.max(targetProgressRef.current, realPct);
  }, [dreiProgress, total, bgImageReady, effectiveSceneReady]);

  // Smooth progress bar animation loop (monotonically increasing)
  useEffect(() => {
    let rafId: number;
    const animate = () => {
      setDisplayProgress((prev) => {
        const target = targetProgressRef.current;
        if (prev >= target) return prev;
        const step = Math.max(0.45, (target - prev) * 0.14);
        const next = Math.min(target, prev + step);
        return Math.round(next * 10) / 10;
      });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Trigger readyToFade once progress visually reaches 100% and scene is ready
  useEffect(() => {
    if (effectiveSceneReady && displayProgress >= 99.5 && !readyToFade) {
      setReadyToFade(true);
    }
  }, [effectiveSceneReady, displayProgress, readyToFade]);

  // Execute smooth fade-out and completion notification cleanly
  useEffect(() => {
    if (!readyToFade) return;
    setDisplayProgress(100);

    const startFadeTimer = window.setTimeout(() => {
      setFadingOut(true);
    }, 220);

    const finishTimer = window.setTimeout(() => {
      if (onFadeComplete) onFadeComplete();
    }, 950);

    return () => {
      window.clearTimeout(startFadeTimer);
      window.clearTimeout(finishTimer);
    };
  }, [readyToFade, onFadeComplete]);

  const roundedProgress = Math.min(100, Math.round(displayProgress));
  const statusText = useMemo(
    () => getStatusMessage(item, roundedProgress, effectiveSceneReady, bgImageReady),
    [item, roundedProgress, effectiveSceneReady, bgImageReady]
  );

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Nordlys Arctic Experience"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none transition-opacity duration-700 ease-out ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "radial-gradient(ellipse at 50% 35%, #0c2238 0%, #06101f 58%, #030811 100%)"
      }}
    >
      {/* 1. Gentle Tromso Aurora Ambient Gradient */}
      <div
        aria-hidden="true"
        className={`absolute -top-1/3 left-1/2 -translate-x-1/2 w-[140vw] max-w-[1400px] h-[70vh] rounded-full blur-[110px] pointer-events-none ${
          reducedMotion ? "" : "reduced-motion-stop"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0, 255, 128, 0.22) 0%, rgba(37, 229, 209, 0.18) 45%, rgba(117, 85, 217, 0.14) 75%, transparent 100%)",
          animation: reducedMotion ? "none" : "auroraSway 10s ease-in-out infinite"
        }}
      />

      {/* Secondary icy turquoise glow */}
      <div
        aria-hidden="true"
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[50vh] rounded-full blur-[100px] pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(37, 229, 209, 0.25) 0%, transparent 70%)"
        }}
      />

      {/* 2. Subtle Animated Snowfall Particles */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {SNOW_PARTICLES.map((p) => (
            <span
              key={p.id}
              className="absolute top-0 rounded-full bg-white"
              style={{
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                boxShadow: "0 0 6px rgba(113, 245, 213, 0.7)",
                animation: `loadingSnowDrift ${p.duration}s linear ${p.delay}s infinite`
              }}
            />
          ))}
        </div>
      )}

      {/* 3. Main Glassmorphic Center Card */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-10 sm:px-12 sm:py-12 mx-4 max-w-md w-full rounded-3xl bg-[#06101f]/65 backdrop-blur-2xl border border-cyan-300/20 shadow-[0_25px_70px_rgba(0,0,0,0.7)]">
        {/* Soft Glowing Snowflake Centerpiece */}
        <div className="relative mb-7 flex items-center justify-center">
          <div
            className="absolute w-28 h-28 rounded-full blur-2xl opacity-65 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(0, 255, 128, 0.45) 0%, rgba(37, 229, 209, 0.28) 55%, transparent 100%)"
            }}
          />

          <div
            className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400/20 via-cyan-500/20 to-violet-500/20 border border-emerald-300/35 flex items-center justify-center backdrop-blur-xl"
            style={{
              animation: reducedMotion ? "none" : "pulseGlow 3.2s ease-in-out infinite"
            }}
          >
            <Snowflake
              className={`w-10 h-10 text-[#71F5D5] drop-shadow-[0_0_12px_rgba(0,255,128,0.65)] ${
                reducedMotion ? "" : "animate-spin"
              }`}
              style={{ animationDuration: "10s" }}
            />
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-[0.32em] uppercase bg-gradient-to-r from-white via-[#71F5D5] to-[#00FF80] bg-clip-text text-transparent mb-2 drop-shadow-[0_2px_12px_rgba(0,255,128,0.3)]">
          NORDLYS
        </h1>

        {/* Headline */}
        <h2 className="text-base sm:text-lg font-semibold text-slate-100 tracking-wide mb-1.5">
          Preparing Your Arctic Winter
        </h2>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-amber-200/85 font-light italic tracking-wider mb-7">
          Where the Northern Lights come alive...
        </p>

        {/* Smooth Animated Progress Bar */}
        <div className="w-full max-w-xs space-y-2.5">
          <div className="relative w-full h-2 rounded-full bg-[#030811]/80 border border-white/15 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00D978] via-[#25E5D1] to-amber-300 relative transition-[width] duration-200 ease-out"
              style={{ width: `${roundedProgress}%` }}
            >
              {!reducedMotion && (
                <div
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  style={{ animation: "shimmerProgress 1.8s ease-in-out infinite" }}
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium px-0.5">
            <span className="text-cyan-100/75 truncate max-w-[200px]">
              {statusText}
            </span>
            <span className="text-emerald-300 font-mono font-bold tabular-nums">
              {roundedProgress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
