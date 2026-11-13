import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { ChristmasLightsProps } from "../types";

const BULB_COLORS = [
  "#ffbe0b", // warm gold
  "#fb5607", // orange
  "#ff006e", // ruby red
  "#8338ec", // purple
  "#3a86ff", // blue
  "#06d6a0"  // emerald
];

export function ChristmasLights({
  position = [0, 0, 0],
  count = 28,
  radius = 1.4,
  height = 3.0,
  animated = true
}: ChristmasLightsProps) {
  const lightsGroupRef = useRef<THREE.Group>(null);

  // Generate spiral coordinates for bulbs around the tree
  const bulbs = useMemo(() => {
    const list: Array<{
      pos: [number, number, number];
      color: string;
      phase: number;
    }> = [];

    for (let i = 0; i < count; i++) {
      const frac = i / count;
      const angle = frac * Math.PI * 7;
      const currentRadius = radius * (1 - frac * 0.7);
      const y = frac * height + 1.2;
      const x = Math.cos(angle) * currentRadius;
      const z = Math.sin(angle) * currentRadius;

      list.push({
        pos: [x, y, z],
        color: BULB_COLORS[i % BULB_COLORS.length],
        phase: i * 0.4
      });
    }

    return list;
  }, [count, radius, height]);

  useFrame(({ clock }) => {
    if (!animated || !lightsGroupRef.current) return;
    const t = clock.getElapsedTime() * 2.5;

    // Twinkling animation across bulbs
    lightsGroupRef.current.children.forEach((child, idx) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const pulse = 0.5 + 0.5 * Math.sin(t + idx * 0.8);
        child.material.emissiveIntensity = 0.6 + pulse * 1.2;
      }
    });
  });

  return (
    <group ref={lightsGroupRef} position={position}>
      {bulbs.map((bulb, idx) => (
        <mesh key={`bulb-${idx}`} position={bulb.pos}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial
            color={bulb.color}
            emissive={bulb.color}
            emissiveIntensity={1.0}
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export default ChristmasLights;

