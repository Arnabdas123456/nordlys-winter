# Nordlys ✨

> *"Where the Northern Lights come alive."*

A procedural Norwegian Aurora Borealis & Arctic winter experience — featuring a reusable React Three Fiber NPM package (`nordlys-winter`) and an interactive Next.js application inspired by Tromsø, Norway.

Built with **React 19**, **Next.js 16**, **Three.js**, **React Three Fiber (R3F)**, **Custom GLSL Shaders**, **Tailwind CSS**, and **TypeScript**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

---

## 🌟 Highlights

- 🌌 **Procedural Norway Aurora Borealis**: Custom GLSL shaders with FBM noise, domain warping, and vertical solar ray curtains in authentic Tromsø colors (`#00FF80`, `#00D978`, `#25E5D1`, `#71F5D5`, `#7555D9`, `#06101F`).
- ❄️ **High-Performance Snowfall**: GPU buffer particle system capable of animating thousands of flakes with wind drift and speed presets at 60 FPS.
- ⛄ **Interactive Arctic Winter Scene**: Snowman companion, pine trees, PBR snow terrain, and twinkling night sky starfield.
- 📦 **Reusable `nordlys-winter` Package**: ESM + CommonJS bundled via `tsup`, complete with TypeScript declarations and tree-shakeable exports.
- 📱 **Responsive & Accessible**: Multi-tier graphics quality (`low`, `medium`, `high`), WebGL fallback, and `prefers-reduced-motion` support.

---

## 📁 Repository Structure

```
nordlys-winter-monorepo/
├── apps/
│   └── demo/                     # Next.js 16 interactive Nordlys experience
├── packages/
│   └── nordlys-winter/           # Core reusable React 3D & GLSL aurora npm package
└── tests/                        # Vitest unit & export test suite
```

---

## 🚀 Quick Start

### 1. Installation

```bash
npm install nordlys-winter three @react-three/fiber @react-three/drei
```

Import the stylesheet in your app:

```tsx
import "nordlys-winter/styles.css";
```

### 2. Basic Usage

```tsx
import React from "react";
import { NordlysScene } from "nordlys-winter";
import "nordlys-winter/styles.css";

export default function WinterPage() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <NordlysScene
        aurora
        snowfall
        stars
        auroraIntensity={1}
        auroraSpeed={0.4}
        snowDensity={3000}
        quality="high"
      />
    </div>
  );
}
```

---

## 🛠️ Monorepo Commands

```bash
# Install all dependencies across workspaces
npm install

# Run the Next.js website
npm run dev

# Build both nordlys-winter package and demo website
npm run build

# Run unit and integration tests
npm run test

# TypeScript type checks
npm run typecheck

# Verify npm package tarball contents
npm run pack:check
```

---

## 📄 License

MIT © Arnab Das