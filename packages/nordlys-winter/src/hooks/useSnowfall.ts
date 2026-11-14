import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getSnowSpeedFromLevel } from "../types";

export const MAX_SNOW_PARTICLES = 10000;

interface UseSnowfallOptions {
  count?: number;
  speed?: number;
  speedLevel?: number;
  wind?: number;
  blizzardMode?: boolean;
  areaWidth?: number;
  areaHeight?: number;
  areaDepth?: number;
}

export function useSnowfall({
  count = 3000,
  speed,
  speedLevel = 3,
  wind = 0.35,
  blizzardMode = false,
  areaWidth = 45,
  areaHeight = 28,
  areaDepth = 45
}: UseSnowfallOptions = {}) {
  const pointsRef = useRef<THREE.Points>(null);

  // Target speed derived from level or explicit speed prop
  const targetSpeed = useMemo(() => {
    const baseSpeed = speed !== undefined ? speed : getSnowSpeedFromLevel(speedLevel);
    return blizzardMode ? baseSpeed * 1.8 : baseSpeed;
  }, [speed, speedLevel, blizzardMode]);

  // Current interpolated speed for smooth transitions
  const currentSpeedRef = useRef(targetSpeed);

  const minY = -6;
  const maxY = minY + areaHeight;

  // Pre-allocate maximum buffer capacity (10,000 points) so slider density changes do not reallocate GPU memory
  const [positions, velocities, sizes] = useMemo(() => {
    const pos = new Float32Array(MAX_SNOW_PARTICLES * 3);
    const vel = new Float32Array(MAX_SNOW_PARTICLES * 3);
    const sz = new Float32Array(MAX_SNOW_PARTICLES);

    for (let i = 0; i < MAX_SNOW_PARTICLES; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * areaWidth;
      pos[i3 + 1] = minY + Math.random() * areaHeight;
      pos[i3 + 2] = (Math.random() - 0.5) * areaDepth;

      // Vertical falling weight and horizontal drift coefficients
      vel[i3] = (Math.random() - 0.5) * 0.2;
      vel[i3 + 1] = 0.6 + Math.random() * 0.8;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.15;

      // Particle size variation
      sz[i] = 0.08 + Math.random() * 0.18;
    }

    return [pos, vel, sz];
  }, [areaWidth, areaHeight, areaDepth]);

  // Update draw range efficiently whenever count changes
  useEffect(() => {
    if (pointsRef.current && pointsRef.current.geometry) {
      const clampedCount = Math.max(0, Math.min(MAX_SNOW_PARTICLES, count));
      pointsRef.current.geometry.setDrawRange(0, clampedCount);
    }
  }, [count]);

  useFrame((_, delta) => {
    if (typeof document !== "undefined" && document.hidden) return;
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    if (!posAttr) return;

    const array = posAttr.array as Float32Array;
    const dt = Math.min(delta, 0.1);

    // Smoothly lerp towards target speed to eliminate visual hitching
    currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * Math.min(1, dt * 5);
    const activeSpeed = currentSpeedRef.current;
    const activeWind = blizzardMode ? wind * 2.2 + 0.4 : wind;

    const clampedCount = Math.min(MAX_SNOW_PARTICLES, count);
    const speedFactor = activeSpeed * dt * 4.2;
    const windStep = activeWind * 0.12 * (dt * 3.0);
    const windSwayMul = 0.03 * activeWind * (dt * 3.0);
    const halfWidth = areaWidth * 0.5;
    const boundLimit = halfWidth + 5;

    for (let i = 0; i < clampedCount; i++) {
      const i3 = i * 3;

      // Vertical falling speed with individual particle weight
      array[i3 + 1] -= velocities[i3 + 1] * speedFactor;
      const y = array[i3 + 1];

      // Horizontal wind drift and organic swirling turbulence
      const sway = Math.sin(y * 0.4 + (i & 31) * 0.2) * windSwayMul;
      array[i3] += windStep + sway;
      array[i3 + 2] += sway * 0.4;

      // Recycle snowflake when it passes below ground level
      if (y < minY) {
        array[i3 + 1] = maxY;
        array[i3] = (Math.random() - 0.5) * areaWidth;
        array[i3 + 2] = (Math.random() - 0.5) * areaDepth;
      } else if (Math.abs(array[i3]) > boundLimit) {
        // Recycle horizontally if drifted outside bounds
        array[i3] = -Math.sign(array[i3]) * halfWidth;
      }
    }

    // Only upload active particle slice to GPU instead of full 10,000 floats
    posAttr.needsUpdate = true;
    const attr = posAttr as any;
    if (typeof attr.addUpdateRange === "function") {
      attr.clearUpdateRanges?.();
      attr.addUpdateRange(0, clampedCount * 3);
    } else if (attr.updateRange) {
      attr.updateRange.offset = 0;
      attr.updateRange.count = clampedCount * 3;
    }
  });

  return { pointsRef, positions, sizes, currentSpeedRef };
}
