import type { QualityPreset } from "../types";

export interface QualityConfig {
  dpr: [number, number];
  particleMultiplier: number;
  shadows: boolean;
  antialias: boolean;
}

export const QUALITY_CONFIGS: Record<QualityPreset, QualityConfig> = {
  low: {
    dpr: [1, 1],
    particleMultiplier: 0.4,
    shadows: false,
    antialias: false
  },
  medium: {
    dpr: [1, 1.5],
    particleMultiplier: 0.75,
    shadows: true,
    antialias: true
  },
  high: {
    dpr: [1, 2],
    particleMultiplier: 1.0,
    shadows: true,
    antialias: true
  }
};

/**
 * Detects mobile devices based on User Agent and touch/viewport capabilities.
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isSmallScreen = window.innerWidth <= 768;
  return isMobileUA || (isTouch && isSmallScreen);
}

/**
 * Returns adaptive DPR constrained for mobile screens to eliminate GPU fill-rate lag.
 * Mobile DPR is kept between 1.0 and 1.25 (or 1.35 on high), while desktop retains up to 2.0.
 */
export function getAdaptiveDpr(
  quality: QualityPreset,
  mobile: boolean = isMobileDevice()
): [number, number] {
  if (!mobile) {
    if (quality === "low") return [1, 1];
    if (quality === "medium") return [1, 1.5];
    return [1, 2];
  }
  // Mobile adaptive DPR
  if (quality === "low") return [1, 1];
  if (quality === "medium") return [1, 1.2];
  return [1, 1.35];
}

/**
 * Returns quality configuration adapted for device capabilities.
 */
export function getQualityConfig(
  quality: QualityPreset,
  mobile: boolean = isMobileDevice()
): QualityConfig {
  const base = QUALITY_CONFIGS[quality] || QUALITY_CONFIGS.high;
  if (!mobile) return base;

  return {
    dpr: getAdaptiveDpr(quality, true),
    particleMultiplier: quality === "high" ? 0.75 : quality === "medium" ? 0.5 : 0.3,
    shadows: quality === "high", // disable shadows on mobile medium/low
    antialias: quality !== "low"
  };
}

export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

