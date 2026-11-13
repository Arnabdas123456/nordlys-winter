import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useSnowfall } from "../hooks/useSnowfall";
import type { SnowfallProps } from "../types";

export function Snowfall({
  count = 3000,
  speed,
  speedLevel = 3,
  wind = 0.35,
  size = 0.12,
  blizzardMode = false,
  areaWidth = 45,
  areaHeight = 28,
  areaDepth = 45
}: SnowfallProps) {
  const { pointsRef, positions } = useSnowfall({
    count,
    speed,
    speedLevel,
    wind,
    blizzardMode,
    areaWidth,
    areaHeight,
    areaDepth
  });

  // Soft circular snowflake texture created programmatically on a canvas
  const snowflakeTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0.3, "rgba(235, 245, 255, 0.85)");
    gradient.addColorStop(0.7, "rgba(200, 225, 255, 0.35)");
    gradient.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }, []);

  useEffect(() => {
    if (!snowflakeTexture) return;
    snowflakeTexture.needsUpdate = true;
    return () => {
      snowflakeTexture.dispose();
    };
  }, [snowflakeTexture]);

  return (
    <points ref={pointsRef} renderOrder={2}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={blizzardMode ? size * 1.3 : size}
        map={snowflakeTexture || undefined}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={blizzardMode ? "#e0f2fe" : "#f0f6ff"}
        opacity={blizzardMode ? 0.95 : 0.85}
      />
    </points>
  );
}

export default Snowfall;
