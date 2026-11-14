export { NordlysScene, default } from "./NordlysScene";

// Procedural Norwegian Aurora Borealis & Arctic Environment
export {
  AuroraShader,
  createAuroraShaderMaterial,
  AURORA_VERTEX_SHADER,
  AURORA_FRAGMENT_SHADER
} from "./components/AuroraShader";
export { AuroraRibbons } from "./components/AuroraRibbons";
export { AuroraStars } from "./components/AuroraStars";
export { AuroraEnvironment } from "./components/AuroraEnvironment";

// Individual 3D Winter Components for custom R3F canvases
export { Snowfall } from "./components/Snowfall";
export { Snowman } from "./components/Snowman";
export { ChristmasTree } from "./components/ChristmasTree";
export { ChristmasLights } from "./components/ChristmasLights";
export { ChristmasBell } from "./components/ChristmasBell";
export { WinterGround } from "./components/WinterGround";

// Hooks
export { useSnowfall, MAX_SNOW_PARTICLES } from "./hooks/useSnowfall";
export { useCamera } from "./hooks/useCamera";
export { useWinterAnimation } from "./hooks/useWinterAnimation";

// Utilities
export {
  isWebGLAvailable,
  prefersReducedMotion,
  isMobileDevice,
  getAdaptiveDpr,
  getQualityConfig,
  QUALITY_CONFIGS
} from "./utils/performance";
export { disposeObject } from "./utils/cleanup";
export { randomRange, randomChoice, randomVectorInBox } from "./utils/random";
export { initThreeLogger } from "./utils/timer";

// Speed levels helper
export { SNOW_SPEED_LEVELS, getSnowSpeedFromLevel } from "./types";

// Types
export type {
  NordlysSceneProps,
  AuroraShaderProps,
  AuroraRibbonsProps,
  AuroraStarsProps,
  AuroraEnvironmentProps,
  SnowfallProps,
  SnowmanProps,
  ChristmasTreeProps,
  ChristmasLightsProps,
  ChristmasBellProps,
  WinterGroundProps,
  QualityPreset,
  ThemePreset,
  SnowSpeedConfig
} from "./types";
