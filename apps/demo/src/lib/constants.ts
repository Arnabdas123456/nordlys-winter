import type { SceneSettings } from "../types";

export const DEFAULT_SCENE_SETTINGS: SceneSettings = {
  aurora: true,
  auroraIntensity: 0.75,
  auroraSpeed: 0.4,
  snowfall: true,
  snowDensity: 3000,
  snowSpeed: 1.4,
  windStrength: 0.35,
  showSnowman: true,
  cameraMovement: false,
  quality: "high",
  theme: "nordlys"
};

export const AUDIO_CONFIG = {
  src: "/audio/snowman.mp3",
  title: "Snowman",
  artist: "Sia",
  album: "Everyday Is Christmas (2017)",
  defaultVolume: 0.7
};
