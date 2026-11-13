import { create } from "zustand";
import type { QualityPreset } from "../types";

export const SNOWMAN_POSITION_STORAGE_KEY = "nordlys:snowman:position";

function isValidVec3(val: unknown): val is [number, number, number] {
  return (
    Array.isArray(val) &&
    val.length === 3 &&
    val.every((n) => typeof n === "number" && Number.isFinite(n))
  );
}

export interface WinterState {
  // Procedural Norwegian Aurora Borealis
  northernLightsEnabled: boolean;
  auroraIntensity: number; // 0.0 to 1.0 (0% to 100%)

  // Snowfall & Weather
  snowfallEnabled: boolean;
  snowSpeedLevel: number; // 1 to 10
  snowDensity: number; // 500 to 10000

  // Quality Preset
  qualityPreset: QualityPreset;

  // Direct Snowman Dragging & Saved Position
  snowmanPosition: [number, number, number] | null;
  isDraggingSnowman: boolean;
  snowmanPlacementHydrated: boolean;

  // Actions
  setNorthernLightsEnabled: (enabled: boolean) => void;
  setAuroraIntensity: (intensity: number) => void;
  setSnowfallEnabled: (enabled: boolean) => void;
  setSnowSpeedLevel: (level: number) => void;
  setSnowDensity: (density: number) => void;
  setQualityPreset: (preset: QualityPreset) => void;
  resetDefaults: () => void;

  // Snowman Position Actions
  setIsDraggingSnowman: (dragging: boolean) => void;
  saveSnowmanPosition: (position: [number, number, number]) => void;
  resetSnowmanPosition: () => void;
  hydrateSnowmanPosition: () => void;
}

const DEFAULT_WINTER_STATE = {
  northernLightsEnabled: true,
  auroraIntensity: 0.75,
  snowfallEnabled: true,
  snowSpeedLevel: 3,
  snowDensity: 3000,
  qualityPreset: "high" as QualityPreset
};

export const useWinterStore = create<WinterState>((set, get) => ({
  ...DEFAULT_WINTER_STATE,

  snowmanPosition: null,
  isDraggingSnowman: false,
  snowmanPlacementHydrated: false,

  setNorthernLightsEnabled: (northernLightsEnabled) => set({ northernLightsEnabled }),
  setAuroraIntensity: (auroraIntensity) =>
    set({ auroraIntensity: Math.max(0, Math.min(1, auroraIntensity)) }),
  setSnowfallEnabled: (snowfallEnabled) => set({ snowfallEnabled }),
  setSnowSpeedLevel: (level) =>
    set({ snowSpeedLevel: Math.max(1, Math.min(10, Math.round(level))) }),
  setSnowDensity: (snowDensity) =>
    set({ snowDensity: Math.max(500, Math.min(10000, Math.round(snowDensity))) }),
  setQualityPreset: (qualityPreset) => set({ qualityPreset }),
  resetDefaults: () => set({ ...DEFAULT_WINTER_STATE }),

  setIsDraggingSnowman: (isDraggingSnowman) => set({ isDraggingSnowman }),

  saveSnowmanPosition: (position) => {
    set({ snowmanPosition: position });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(SNOWMAN_POSITION_STORAGE_KEY, JSON.stringify(position));
      } catch {
        // Ignore storage errors in restricted contexts
      }
    }
  },

  resetSnowmanPosition: () => {
    set({ snowmanPosition: null });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(SNOWMAN_POSITION_STORAGE_KEY);
      } catch {
        // Ignore storage errors
      }
    }
  },

  hydrateSnowmanPosition: () => {
    if (get().snowmanPlacementHydrated || typeof window === "undefined") return;

    let savedPos: [number, number, number] | null = null;
    try {
      const rawPos = window.localStorage.getItem(SNOWMAN_POSITION_STORAGE_KEY);
      if (rawPos) {
        const parsed = JSON.parse(rawPos);
        if (isValidVec3(parsed)) savedPos = parsed;
      }
    } catch {
      // Ignore malformed JSON in localStorage
    }

    set({
      snowmanPosition: savedPos,
      snowmanPlacementHydrated: true
    });
  }
}));
