# 🌌 Nordlys Winter (`nordlys-winter`)

> **Procedural Norwegian Aurora Borealis & Arctic Winter 3D Experience for React Three Fiber.**

[![npm version](https://img.shields.io/npm/v/nordlys-winter?color=00FF80&label=npm%20package)](https://www.npmjs.com/package/nordlys-winter)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r150%2B-black.svg)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg)](https://www.typescriptlang.org/)

**Nordlys Winter** brings the magical Northern Lights of Tromsø, Norway, directly into your web applications. Built from the ground up for **React 18 & 19**, **Three.js**, and **@react-three/fiber**, it features procedural GLSL Aurora Borealis light curtains, a smooth multi-thousand particle snowfall system, twinkling Arctic starfields, interactive 3D winter elements (animated snowman, snow-covered pine trees, holiday bells, and fairy lights), and multi-tier graphics quality presets.

Every component is **100% procedural with zero external 3D model or texture dependencies**—no asset bundling required, no 404 network fetches, and zero hydration mismatches.

---

## 🌟 Key Features

- 🌌 **Procedural Tromsø Aurora Borealis**: Custom GLSL vertex and fragment shaders with multi-octave Fractional Brownian Motion (FBM) noise, domain warping, ray swaying, and organic curtain deformation in authentic Arctic colors (`#00FF80`, `#00D978`, `#25E5D1`, `#71F5D5`, `#7555D9`).
- ❄️ **High-Performance Snowfall**: Pre-allocated Float32Array buffer particle system capable of rendering up to 10,000 snowflakes with zero per-frame garbage collection allocations, realistic wind drift, turbulence, blizzard mode, and 10 discrete speed levels.
- ✨ **Arctic Night Sky Starfield**: Twinkling multi-colored celestial starfield (`AuroraStars`) with randomized phase offsets, warm starlight, and icy turquoise tints.
- ⛄ **Interactive 3D Snowman**: Procedural animated character featuring subtle idle breathing, head tilts, arm waving, wind-fluttering scarf, periodic eye blinking, and playful click-jump bounce physics.
- 🌲 **Pine Trees & Holiday Accents**: Snowy procedural Christmas trees (`ChristmasTree`), spiral tree fairy lights (`ChristmasLights`), and interactive swinging bells (`ChristmasBell`).
- 🏔️ **Winter Ground Terrain**: Soft snowy terrain bank (`WinterGround`) with gentle drifts and an optional frozen lake.
- 🎨 **Visual Themes**: Four curated atmospheric presets: `nordlys` (classic vibrant emerald), `lapland` (deep arctic winter), `twilight` (cool dusk), and `midnight` (deep polar night).
- ⚡ **Multi-Tier Quality Scaling**: `low`, `medium`, and `high` graphics presets dynamically adjusting DPR, shadow maps, shader octaves, ribbon mesh density, and particle counts for smooth 60 FPS performance on both mobile and desktop.
- ♿ **Accessibility & Fallback**: Automatic detection for `prefers-reduced-motion` (pauses shader waves and particle turbulence) and built-in graceful fallback when WebGL is unavailable or during SSR.
- 🧩 **Drop-in or Modular**: Use `<NordlysScene />` as an all-in-one full-screen experience or import individual building blocks (`AuroraEnvironment`, `Snowfall`, `Snowman`, etc.) into your existing R3F `<Canvas>`.

---

## 📦 Compatibility & Requirements

| Package | Supported Version | Notes |
| :--- | :--- | :--- |
| **React** | `^18.0.0` or `^19.0.0` | Full support for React 18 and React 19 concurrent features |
| **React DOM** | `^18.0.0` or `^19.0.0` | Matches React version |
| **Three.js** | `>=0.150.0` | Compatible with Three.js `r150` up through `r187+` |
| **@react-three/fiber** | `>=8.0.0` or `>=9.0.0` | Peer dependency for canvas and scene context |
| **@react-three/drei** | `>=9.0.0` or `>=10.0.0` | *Optional* peer dependency |

---

## 🚀 Installation

Install `nordlys-winter` and its required peer dependencies:

```bash
# npm
npm install nordlys-winter three @react-three/fiber

# pnpm
pnpm add nordlys-winter three @react-three/fiber

# yarn
yarn add nordlys-winter three @react-three/fiber
```

*(Optional: Install `@react-three/drei` if your project uses Drei camera helpers or controls)*

```bash
npm install @react-three/drei
```

### Import Styles

Import the core CSS stylesheet in your root layout or application entry point:

```tsx
import "nordlys-winter/styles.css";
```

---

## 💻 Quick Start

### 1. All-in-One Drop-in Scene (`<NordlysScene />`)

The simplest way to use Nordlys Winter is through the `<NordlysScene />` component, which automatically creates and configures its own WebGL Canvas, camera rig, lighting, and environment:

```tsx
import React from "react";
import { NordlysScene } from "nordlys-winter";
import "nordlys-winter/styles.css";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <NordlysScene
        theme="nordlys"
        aurora={true}
        auroraIntensity={1.0}
        auroraSpeed={0.4}
        stars={true}
        snowfall={true}
        snowDensity={3000}
        snowSpeedLevel={3}
        windStrength={0.35}
        showSnowman={true}
        showChristmasTrees={true}
        showGround={true}
        quality="high"
      />
    </div>
  );
}
```

> **Note:** The parent container must have an explicit width and height (e.g. `100vw` / `100vh` or fixed dimensions) because Three.js canvas expands to 100% of its containing element.

---

## ⚡ Next.js Integration (App Router & Pages Router)

Three.js and WebGL require the browser's `window` and DOM canvas context. In Next.js, render the scene inside a client component with dynamic imports and Server-Side Rendering (SSR) disabled:

```tsx
// app/components/NordlysClient.tsx
"use client";

import dynamic from "next/dynamic";
import "nordlys-winter/styles.css";

// Disable SSR for WebGL canvas
const NordlysScene = dynamic(
  () => import("nordlys-winter").then((mod) => mod.NordlysScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-[#06101f] text-emerald-300">
        <p className="tracking-widest uppercase text-sm font-semibold">
          Loading Arctic Winter Experience...
        </p>
      </div>
    )
  }
);

export default function NordlysClient() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#06101f]">
      <NordlysScene
        theme="nordlys"
        aurora
        snowfall
        stars
        quality="high"
      />
    </div>
  );
}
```

Then render `<NordlysClient />` anywhere in your `app/page.tsx`:

```tsx
// app/page.tsx
import NordlysClient from "./components/NordlysClient";

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <NordlysClient />
    </main>
  );
}
```

---

## 🧩 Modular Components (Custom R3F Canvas)

If your application already manages its own `@react-three/fiber` `<Canvas>`, you can import individual components and compose them freely:

```tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import {
  AuroraEnvironment,
  AuroraRibbons,
  AuroraStars,
  Snowfall,
  Snowman,
  ChristmasTree,
  ChristmasLights,
  ChristmasBell,
  WinterGround
} from "nordlys-winter";
import "nordlys-winter/styles.css";

export function CustomWinterScene() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas
        camera={{ position: [0, 1.45, 7.0], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        {/* Arctic sky environment with Tromsø aurora ribbons and stars */}
        <AuroraEnvironment
          theme="nordlys"
          aurora={true}
          auroraIntensity={1.0}
          auroraSpeed={0.4}
          stars={true}
          quality="high"
        />

        {/* Soft ground snow bank */}
        <WinterGround size={40} snowColor="#f0f6fc" />

        {/* Snowfall particle system */}
        <Snowfall count={3000} speedLevel={3} wind={0.35} />

        {/* Animated procedural snowman */}
        <Snowman
          position={[0, -0.6, 0]}
          scale={1.05}
          animate={true}
          waving={true}
          onClick={() => console.log("Snowman jumped!")}
        />

        {/* Pine trees framing the scene */}
        <ChristmasTree position={[-3.2, -0.6, -1.0]} scale={1.2} snowCovered={true} />
        <ChristmasTree position={[3.2, -0.6, -1.2]} scale={1.25} snowCovered={true} />

        {/* Optional holiday lights and swinging bells */}
        <ChristmasLights position={[-3.2, -0.6, -1.0]} count={28} radius={1.6} height={3.6} />
        <ChristmasBell position={[3.2, 3.0, -0.4]} scale={0.75} swingSpeed={1.8} />
      </Canvas>
    </div>
  );
}
```

---

## ⚙️ Props API Reference

### `<NordlysScene />`

The primary all-in-one drop-in scene component.

| Prop | Type | Default | Description | Valid Range |
| :--- | :--- | :--- | :--- | :--- |
| `theme` | `ThemePreset` | `"nordlys"` | Color atmosphere preset. | `"nordlys"` \| `"lapland"` \| `"twilight"` \| `"midnight"` |
| `aurora` | `boolean` | `true` | Toggle the procedural Aurora Borealis shader curtains. | `true` \| `false` |
| `auroraIntensity` | `number` | `1.0` | Perceptual brightness multiplier for the Aurora curtains. `0` discards shader fragments; `1.0` is realistic; `>1.0` adds radiant glow. | `0.0` - `2.0` |
| `auroraSpeed` | `number` | `0.4` | Wave velocity multiplier for the curtains. | `0.0` - `2.0` |
| `stars` | `boolean` | `true` | Toggle the twinkling Arctic night sky stars. | `true` \| `false` |
| `snowfall` | `boolean` | `true` | Toggle the falling snow particle system. | `true` \| `false` |
| `snowDensity` | `number` | `3000` | Base snowflake count (scaled by `quality`). | `100` - `10000` |
| `snowSpeed` | `number` | `undefined` | Direct falling speed override. Overrides `snowSpeedLevel` if set. | `0.1` - `10.0` |
| `snowSpeedLevel` | `number` | `3` | Discrete snowfall speed level (1 = Very Gentle, 10 = Blizzard). | `1` - `10` |
| `windStrength` | `number` | `0.35` | Horizontal wind velocity and turbulent sway. | `0.0` - `2.0` |
| `blizzardMode` | `boolean` | `false` | Boosts wind turbulence, snowflake opacity, size, and speed. | `true` \| `false` |
| `showSnowman` | `boolean` | `true` | Toggle the procedural animated snowman. | `true` \| `false` |
| `showChristmasTrees`| `boolean` | `true` | Toggle the framing snowy pine trees. | `true` \| `false` |
| `showChristmasLights`| `boolean`| `false` | Toggle the twinkling fairy lights on the left pine tree. | `true` \| `false` |
| `showChristmasBells`| `boolean` | `false` | Toggle the swinging golden Christmas bells. | `true` \| `false` |
| `showCabins` | `boolean` | `false` | Toggle the distant glowing Nordic log cabin. | `true` \| `false` |
| `showGround` | `boolean` | `true` | Toggle the ground snow plane and drifts. | `true` \| `false` |
| `showMoon` | `boolean` | `false` | Toggle the Arctic glowing moon in the sky. | `true` \| `false` |
| `cameraMovement` | `boolean` | `true` | Enable gentle cinematic swaying and mouse pointer parallax. | `true` \| `false` |
| `quality` | `QualityPreset` | `"high"` | Overall rendering quality preset. | `"low"` \| `"medium"` \| `"high"` |
| `className` | `string` | `""` | Additional CSS class for the container element. | Any valid string |
| `style` | `CSSProperties` | `{}` | Inline CSS styles applied to the container element. | React CSS object |
| `fallback` | `ReactNode` | `undefined` | Custom React node displayed when WebGL is unavailable. | Any valid React node |
| `children` | `ReactNode` | `undefined` | Optional extra R3F 3D elements injected into the canvas scene. | Any valid R3F elements |

---

### `<Snowfall />`

Pre-allocated Float32Array buffer particle system.

| Prop | Type | Default | Description | Valid Range |
| :--- | :--- | :--- | :--- | :--- |
| `count` | `number` | `3000` | Number of active snowflakes (capped at `10000`). | `0` - `10000` |
| `speed` | `number` | `undefined` | Custom falling speed. Overrides `speedLevel` when specified. | `> 0` |
| `speedLevel` | `number` | `3` | Discrete speed level (1 to 10). Maps to realistic falling speeds. | `1` - `10` |
| `wind` | `number` | `0.35` | Horizontal wind velocity and turbulent oscillation. | `0.0` - `2.0` |
| `size` | `number` | `0.12` | Base snowflake point size. | `0.05` - `0.5` |
| `blizzardMode` | `boolean` | `false` | Increases speed by 1.8x, amplifies wind by 2.2x, and enlarges flakes. | `true` \| `false` |
| `areaWidth` | `number` | `45` | Width of the snowfall bounding volume. | `> 0` |
| `areaHeight` | `number` | `28` | Height of the snowfall bounding volume. | `> 0` |
| `areaDepth` | `number` | `45` | Depth of the snowfall bounding volume. | `> 0` |

---

### `<Snowman />`

Procedural 3D snowman character built from Three.js geometries.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `[number, number, number]` | `[0, 0, 0]` | 3D world position coordinates `[x, y, z]`. |
| `scale` | `number \| [number, number, number]` | `1` | Uniform or per-axis scale factor. |
| `rotation` | `[number, number, number]` | `[0, 0, 0]` | Euler rotation angles in radians `[x, y, z]`. |
| `animate` | `boolean` | `true` | Enables breathing, head tilt, arm sway, scarf flutter, and blinking. |
| `waving` | `boolean` | `true` | Makes the snowman actively wave its right arm. |
| `onClick` | `() => void` | `undefined` | Callback invoked when clicked. Automatically triggers jump bounce. |

---

### `<AuroraRibbons />` & `<AuroraShader />`

Custom GLSL Aurora curtain mesh and shader material.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `active` | `boolean` | `true` | Enable or disable curtain rendering. |
| `intensity` | `number` | `1.0` | Brightness multiplier. `0` discards fragments; `1.0` is realistic. |
| `speed` | `number` | `0.4` | Wave animation speed. |
| `quality` | `QualityPreset` | `"high"` | Controls mesh subdivisions and FBM noise octaves (2, 3, or 4). |
| `colorPrimary` | `string` | `"#00FF80"` | Base emerald green Aurora color (hex). |
| `colorSecondary` | `string` | `"#25E5D1"` | Mid-curtain turquoise/cyan Aurora color (hex). |
| `colorAccent` | `string` | `"#7555D9"` | Upper atmospheric violet/purple Aurora glow (hex). |
| `position` | `[number, number, number]` | `[0, 0, 0]` | World position coordinates. |
| `scale` | `number` | `1` | Uniform scale multiplier. |

---

### `<AuroraStars />`

Twinkling Arctic starfield points.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `count` | `number` | `650` | Number of stars generated in the upper sky dome. |
| `active` | `boolean` | `true` | Enable or disable starfield rendering. |
| `twinkleSpeed` | `number` | `1.2` | Speed of the sinusoidal twinkle shimmer. |
| `quality` | `QualityPreset` | `"high"` | Scales star density (100% on high, 75% on medium, 45% on low). |

---

### `<ChristmasTree />`, `<ChristmasLights />`, `<ChristmasBell />`, `<WinterGround />`

| Component | Key Props & Defaults | Description |
| :--- | :--- | :--- |
| `<ChristmasTree />` | `position={[0, 0, 0]}`, `scale={1}`, `snowCovered={true}` | Procedural tiered pine tree with snow caps, trunk, and golden star. Gently sways with the wind. |
| `<ChristmasLights />` | `position={[0, 0, 0]}`, `count={28}`, `radius={1.4}`, `height={3.0}`, `animated={true}` | Multi-colored festive bulb spiral with twinkling emissive materials. |
| `<ChristmasBell />` | `position={[0, 0, 0]}`, `scale={1}`, `color="#ffd700"`, `swingSpeed={2.0}`, `swingAngle={0.25}` | Hanging metallic holiday bell with animated clapper and click-chime physics. |
| `<WinterGround />` | `size={40}`, `snowColor="#f0f6fc"`, `lakeColor="#6ba4c8"`, `hasLake={false}` | Snow terrain ground bank with snowdrift mounds and optional frozen lake. |

---

## 🎨 Theme Presets

Nordlys Winter provides 4 visual theme presets via the `theme` prop:

```tsx
<NordlysScene theme="nordlys" />   {/* Vibrant Tromsø green & turquoise */}
<NordlysScene theme="lapland" />   {/* Frosty Lapland Arctic wilderness */}
<NordlysScene theme="twilight" />  {/* Soft twilight violet-blue atmosphere */}
<NordlysScene theme="midnight" />  {/* Deep polar midnight with icy highlights */}
```

| Theme | Ambient Lighting | Sky Mood | Recommended Use |
| :--- | :--- | :--- | :--- |
| `"nordlys"` | `#c8e1ff` (crisp arctic) | Emerald green & vibrant turquoise | High-impact hero sections, default experience |
| `"lapland"` | `#d0e6ff` (snow reflection) | Deep turquoise & emerald curtain | Cozy holiday village & winter cabin themes |
| `"twilight"` | `#c5d8f7` (violet twilight) | Soft cyan with purple upper crests | Subtle backgrounds, dark mode dashboards |
| `"midnight"`| `#9ab8de` (subdued night) | Deep polar night with focused ribbon | Minimalist headers, text-heavy landing pages |

---

## ❄️ Snowfall Speed Levels

The package exports a helper lookup `SNOW_SPEED_LEVELS` and the `getSnowSpeedFromLevel` utility:

```tsx
import { SNOW_SPEED_LEVELS, getSnowSpeedFromLevel } from "nordlys-winter";
```

| Level | Label | Velocity | Description |
| :---: | :--- | :---: | :--- |
| **1** | Very Gentle | `0.4` | Slow, peaceful floating snowflakes |
| **2** | Soft | `0.7` | Gentle winter drift |
| **3** | Light *(Default)* | `1.0` | Steady, calm snowfall |
| **4** | Normal | `1.4` | Classic winter flurry |
| **5** | Moderate | `1.9` | Noticeable falling motion |
| **6** | Medium-Heavy | `2.5` | Dense winter shower |
| **7** | Heavy | `3.2` | Fast falling winter storm |
| **8** | Very Heavy | `4.0` | Heavy Arctic storm |
| **9** | Intense | `5.0` | Intense gale flurry |
| **10**| Blizzard | `6.5` | High-velocity blizzard |

---

## ⚡ Performance Optimization & Graphics Quality

Control rendering load using the `quality` prop:

```tsx
<NordlysScene quality="medium" />
```

| Quality | Device Pixel Ratio (DPR) | Snow Particle Multiplier | Aurora FBM Octaves | Ribbon Segments | Stars Density | Shadows & Antialias | Target Devices |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `"low"` | `[1, 1]` | `0.4` *(1,200 flakes)* | 2 octaves | `28 × 8` (1 layer) | 45% *(~290 stars)* | Disabled | Mobile phones, older GPUs |
| `"medium"` | `[1, 1.5]` | `0.75` *(2,250 flakes)* | 3 octaves | `48 × 12` (2 layers)| 75% *(~485 stars)* | Enabled | Laptops, tablets |
| `"high"` | `[1, 2]` | `1.0` *(3,000 flakes)* | 4 octaves | `72 × 18` (3 layers)| 100% *(650 stars)* | Enabled | Desktops, high-DPI displays |

### Reduced Motion Support

Nordlys Winter automatically checks `window.matchMedia("(prefers-reduced-motion: reduce)")`:
- When active, the camera rig stops parallax swaying.
- The GLSL Aurora shader wave time halts.
- Snow particles fall smoothly along straight trajectories without turbulent wind swaying.

---

## 💡 Practical Examples

### 1. Minimal Aurora Sky (No Trees, Ground, or Snowman)

Ideal for website headers, text hero backgrounds, or login cards:

```tsx
import { NordlysScene } from "nordlys-winter";
import "nordlys-winter/styles.css";

export function MinimalAuroraSky() {
  return (
    <div style={{ width: "100%", height: "60vh" }}>
      <NordlysScene
        aurora={true}
        auroraIntensity={1.2}
        auroraSpeed={0.3}
        stars={true}
        snowfall={true}
        snowDensity={1000}
        showSnowman={false}
        showChristmasTrees={false}
        showGround={false}
        cameraMovement={false}
      />
    </div>
  );
}
```

### 2. Blizzard Weather Preset

For dramatic, intense Arctic storm effects:

```tsx
<NordlysScene
  snowfall={true}
  snowDensity={6000}
  snowSpeedLevel={9}
  windStrength={0.8}
  blizzardMode={true}
  auroraIntensity={0.6}
/>
```

### 3. Custom Standalone Aurora Canvas

Directly accessing the GLSL Shader Material utility:

```tsx
import { Canvas } from "@react-three/fiber";
import { AuroraRibbons } from "nordlys-winter";

export function StandaloneAurora() {
  return (
    <Canvas camera={{ position: [0, 4, 15] }}>
      <ambientLight intensity={0.5} />
      <AuroraRibbons
        intensity={1.2}
        speed={0.5}
        colorPrimary="#00FF80"
        colorSecondary="#25E5D1"
        colorAccent="#7555D9"
      />
    </Canvas>
  );
}
```

---

## 🔧 Troubleshooting

### 1. "window is not defined" or "document is not defined" in Next.js
**Cause:** Next.js tries to render the WebGL Three.js canvas on the Node.js server during SSR.  
**Solution:** Ensure `"use client";` is added to your wrapper component and load the scene dynamically with `next/dynamic` using `{ ssr: false }`.

### 2. Black or invisible Canvas
**Cause:** The parent HTML element has zero height. Three.js canvas takes `100%` width and height of its parent.  
**Solution:** Add explicit height to the wrapping element:
```tsx
<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
  <NordlysScene />
</div>
```

### 3. Multiple Three.js instances warning
**Cause:** Your bundler resolved duplicate copies of `three` from different packages.  
**Solution:** In `vite.config.ts` or `next.config.js`, deduplicate `three`:
```js
// vite.config.ts
resolve: {
  dedupe: ["three", "@react-three/fiber", "react", "react-dom"]
}
```

### 4. Styles look unformatted or fallback text has no styling
**Cause:** The base CSS stylesheet was not imported.  
**Solution:** Add `import "nordlys-winter/styles.css";` to your application root.

---

## 🛠️ Development & Monorepo Setup

If you are contributing to or developing `nordlys-winter` locally:

### 1. Clone the repository and install dependencies
```bash
git clone https://github.com/arnabdas/nordlys-winter.git
cd nordlys-winter
npm install
```

### 2. Run the interactive Next.js demo application
```bash
npm run dev
# Starts demo at http://localhost:3000
```

### 3. Build the package
```bash
npm run build:package
# Compiles to packages/nordlys-winter/dist (ESM, CJS, DTS, CSS)
```

### 4. Run tests
```bash
npm test
# Executes Vitest test suite across root and workspaces
```

### 5. Verify the npm package tarball
```bash
npm run pack:check
# Runs dry-run package verification
```

## 📄 License

MIT © [Arnab Das](https://github.com/Arnabdas123456)

---

## 💬 Acknowledgments & Feedback

Created with love for Arctic winter landscapes, Norwegian nights in Tromsø, and modern web graphics. If you encounter any bugs or have feature ideas, please open an issue or pull request on GitHub!
