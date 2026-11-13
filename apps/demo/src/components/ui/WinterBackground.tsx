"use client";

import React from "react";

export function WinterBackground() {
  return (
    <div
      className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden select-none bg-[#040d1d]"
      aria-hidden="true"
    >
      {/* Layer 1: Dedicated Full-Screen Christmas Village Photograph (Immediate paint, independent of WebGL) */}
      <img
        src="/images/lapland-winter-cabin.jpg"
        alt=""
        loading="eager"
        decoding="sync"
        fetchPriority="high"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover object-[58%_center] sm:object-center opacity-100"
      />

      {/* Layer 2: Subtle Readability Overlay (Preserves Christmas houses, lights, and snowy road) */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4, 10, 22, 0.5) 0%, rgba(4, 10, 22, 0.2) 34%, rgba(4, 10, 22, 0) 56%, rgba(4, 10, 22, 0) 86%, rgba(4, 10, 22, 0.24) 100%)"
        }}
      />
    </div>
  );
}

export default WinterBackground;
