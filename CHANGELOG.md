# Changelog

All notable changes to the **Nordlys** (`nordlys-winter`) project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-10

### Added
- Rebranded project and website to **Nordlys** ("Where the Northern Lights come alive.") and reusable npm package to `nordlys-winter` with main component `NordlysScene`.
- Original procedural Tromsø Norway Aurora Borealis GLSL engine (`AuroraShader`, `AuroraRibbons`, `AuroraStars`, `AuroraEnvironment`) featuring FBM noise, domain warping, vertical solar rays, and multi-layer translucent curtains (`#00FF80`, `#00D978`, `#25E5D1`, `#71F5D5`, `#7555D9`, `#06101F`).
- Interactive Aurora visibility and intensity controls alongside snowfall speed, density, and multi-tier graphics quality (`low`, `medium`, `high`).
- Cinematic loading screen (`LoadingScreen.tsx`) coordinating real 3D model and PBR texture readiness without refresh overlaps.

### Removed
- Removed background aurora MP4 video (`aurora.mp4`) and all video playback hooks/state in favor of real-time procedural WebGL aurora shaders.
- Removed unused demo wrapper files and unused `gsap` dependency.
