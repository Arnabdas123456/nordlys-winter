"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useWinterStore } from "../../stores/winter-store";

const DynamicWinterScene = dynamic(() => import("./WinterScene"), {
  ssr: false,
  loading: () => null
});

interface WinterCanvasProps {
  onSceneReady?: () => void;
}

export function WinterCanvas({ onSceneReady }: WinterCanvasProps) {
  const [isClient, setIsClient] = useState(false);
  const isDraggingSnowman = useWinterStore((s) => s.isDraggingSnowman);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lock page scrolling only while actively dragging the snowman (prevents accidental touch scroll)
  useEffect(() => {
    if (!isDraggingSnowman || typeof document === "undefined") return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const preventTouchScroll = (e: TouchEvent) => {
      e.preventDefault();
    };
    window.addEventListener("touchmove", preventTouchScroll, { passive: false });

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener("touchmove", preventTouchScroll);
    };
  }, [isDraggingSnowman]);

  if (!isClient) return null;

  return (
    <div
      className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-auto ${
        isDraggingSnowman ? "z-[35] touch-none select-none" : "z-10"
      }`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        touchAction: isDraggingSnowman ? "none" : "auto"
      }}
    >
      <DynamicWinterScene onSceneReady={onSceneReady} />
    </div>
  );
}

export default WinterCanvas;
