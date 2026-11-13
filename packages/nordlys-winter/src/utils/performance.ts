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

