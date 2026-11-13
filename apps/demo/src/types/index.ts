export type QualityPreset = "low" | "medium" | "high";
export type ThemePreset = "nordlys" | "lapland" | "twilight" | "midnight";

export interface SceneSettings {
  aurora: boolean;
  auroraIntensity: number;
  auroraSpeed: number;
  snowfall: boolean;
  snowDensity: number;
  snowSpeed: number;
  windStrength: number;
  showSnowman: boolean;
  cameraMovement: boolean;
  quality: QualityPreset;
  theme: ThemePreset;
}

export interface AudioState {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  isLoaded: boolean;
  hasError: boolean;
  errorMessage: string | null;
  duration: number;
  currentTime: number;
}
