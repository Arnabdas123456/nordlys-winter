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

    for (let i = 0; i < clampedCount; i++) {
      const i3 = i * 3;

      // Vertical falling speed with individual particle weight
      array[i3 + 1] -= velocities[i3 + 1] * activeSpeed * dt * 4.2;

      // Horizontal wind drift and organic swirling turbulence
      const sway = Math.sin(array[i3 + 1] * 0.4 + i * 0.1) * 0.03 * activeWind;
      array[i3] += (activeWind * 0.12 + sway) * (dt * 60 * 0.05);
      array[i3 + 2] += Math.cos(array[i3 + 1] * 0.3 + i * 0.05) * 0.02;

      // Recycle snowflake when it passes below ground level
      if (array[i3 + 1] < minY) {
        array[i3 + 1] = maxY;
        array[i3] = (Math.random() - 0.5) * areaWidth;
        array[i3 + 2] = (Math.random() - 0.5) * areaDepth;
      }

      // Recycle horizontally if drifted outside bounds
      if (Math.abs(array[i3]) > areaWidth / 2 + 5) {
        array[i3] = -Math.sign(array[i3]) * (areaWidth / 2);
      }
    }

    posAttr.needsUpdate = true;
  });

  return { pointsRef, positions, sizes, currentSpeedRef };
}
