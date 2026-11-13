"use client";

import React, { useState } from "react";
import { Navbar } from "../components/ui/Navbar";
import { Hero } from "../components/ui/Hero";
import { WinterCanvas } from "../components/winter/WinterCanvas";
import { WinterBackground } from "../components/ui/WinterBackground";
import { SnowControlPanel } from "../components/controls/SnowControlPanel";
import { MusicPlayer } from "../components/audio/MusicPlayer";
import { Footer } from "../components/ui/Footer";

export default function HomePage() {
  const [controlsOpen, setControlsOpen] = useState(false);

  return (
    <main className="relative min-h-screen w-full text-white selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden flex flex-col justify-between">
      {/* Layers 1 & 2: Full-Screen Christmas Village Background Image & Subtle Readability Overlay */}
      <WinterBackground />

      {/* Layers 3, 4 & 5: Transparent 3D WebGL Canvas (Procedural Aurora, Stars, Snowfall & Snowman) */}
      <WinterCanvas />

      {/* Layer 6: Navigation Bar, Hero Content, Scene Controls, Music Player & Footer */}
      <Navbar
        onToggleControls={() => setControlsOpen(!controlsOpen)}
        controlsOpen={controlsOpen}
      />

      <Hero onExplore={() => setControlsOpen(true)} />

      {controlsOpen && (
        <SnowControlPanel onClose={() => setControlsOpen(false)} />
      )}

      <MusicPlayer />

      <Footer />
    </main>
  );
}
