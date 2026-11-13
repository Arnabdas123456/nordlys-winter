import type { CSSProperties, ReactNode } from "react";

export type QualityPreset = "low" | "medium" | "high";
export type ThemePreset = "nordlys" | "lapland" | "twilight" | "midnight";

export interface SnowSpeedConfig {
  label: string;
  speed: number;
  description: string;
}

export const SNOW_SPEED_LEVELS: Record<number, SnowSpeedConfig> = {
  1: { label: "Very Gentle", speed: 0.4, description: "Very gentle, slow snowfall" },
  2: { label: "Soft", speed: 0.7, description: "Soft snowfall" },
  3: { label: "Light", speed: 1.0, description: "Light snowfall" },
  4: { label: "Normal", speed: 1.4, description: "Normal snowfall" },
  5: { label: "Moderate", speed: 1.9, description: "Moderate snowfall" },
  6: { label: "Medium-Heavy", speed: 2.5, description: "Medium-heavy snowfall" },
  7: { label: "Heavy", speed: 3.2, description: "Heavy snowfall" },
  8: { label: "Very Heavy", speed: 4.0, description: "Very heavy snowfall" },
  9: { label: "Intense", speed: 5.0, description: "Intense snowfall" },
  10: { label: "Blizzard", speed: 6.5, description: "Blizzard-style snowfall" }
};

export function getSnowSpeedFromLevel(level: number): number {
  const clamped = Math.max(1, Math.min(10, Math.round(level)));
  return SNOW_SPEED_LEVELS[clamped]?.speed ?? 1.0;
}

export interface NordlysSceneProps {
  theme?: ThemePreset;
  aurora?: boolean;
  auroraIntensity?: number;
  auroraSpeed?: number;
  stars?: boolean;
  snowfall?: boolean;
  snowDensity?: number;
  snowSpeed?: number;
  snowSpeedLevel?: number;
  windStrength?: number;
  blizzardMode?: boolean;
  showSnowman?: boolean;
  showChristmasTrees?: boolean;
  showChristmasLights?: boolean;
  showChristmasBells?: boolean;
  showCabins?: boolean;
  showGround?: boolean;
  showMoon?: boolean;
  cameraMovement?: boolean;
  quality?: QualityPreset;
  className?: string;
  style?: CSSProperties;
  fallback?: ReactNode;
  children?: ReactNode;
}

export interface AuroraShaderProps {
  intensity?: number;
  speed?: number;
  colorPrimary?: string;
  colorSecondary?: string;
  colorAccent?: string;
  colorBase?: string;
  layerOffset?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  opacity?: number;
  quality?: QualityPreset;
  active?: boolean;
}

export interface AuroraRibbonsProps {
  active?: boolean;
  intensity?: number;
  speed?: number;
  quality?: QualityPreset;
  colorPrimary?: string;
  colorSecondary?: string;
  colorAccent?: string;
  position?: [number, number, number];
  scale?: number;
}

export interface AuroraStarsProps {
  count?: number;
  active?: boolean;
  twinkleSpeed?: number;
  quality?: QualityPreset;
}

export interface AuroraEnvironmentProps {
  theme?: ThemePreset;
  aurora?: boolean;
  auroraIntensity?: number;
  auroraSpeed?: number;
  stars?: boolean;
  showMoon?: boolean;
  quality?: QualityPreset;
}

export interface SnowfallProps {
  count?: number;
  speed?: number;
  speedLevel?: number;
  wind?: number;
  size?: number;
  blizzardMode?: boolean;
  areaWidth?: number;
  areaHeight?: number;
  areaDepth?: number;
}

export interface SnowmanProps {
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  animate?: boolean;
  waving?: boolean;
  onClick?: () => void;
}

export interface ChristmasTreeProps {
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  snowCovered?: boolean;
}

export interface ChristmasLightsProps {
  position?: [number, number, number];
  count?: number;
  radius?: number;
  height?: number;
  animated?: boolean;
}

export interface ChristmasBellProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  swingSpeed?: number;
  swingAngle?: number;
  onClick?: () => void;
}

export interface WinterGroundProps {
  size?: number;
  subdivisions?: number;
  snowColor?: string;
  lakeColor?: string;
  hasLake?: boolean;
}
