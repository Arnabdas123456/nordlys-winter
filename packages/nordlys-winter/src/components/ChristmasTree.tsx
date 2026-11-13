import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { ChristmasTreeProps } from "../types";

export function ChristmasTree({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  snowCovered = true
}: ChristmasTreeProps) {
  const treeGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!treeGroupRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle natural wind swaying
    treeGroupRef.current.rotation.z = Math.sin(t * 1.1 + position[0]) * 0.02;
    treeGroupRef.current.rotation.x = Math.cos(t * 0.9 + position[2]) * 0.015;
  });

  return (
    <group ref={treeGroupRef} position={position} scale={scale} rotation={rotation}>
      {/* Tree Trunk */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.35, 1.5, 12]} />
        <meshStandardMaterial color="#4a2e18" roughness={0.9} />
      </mesh>

      {/* Pine Tier 1 (Bottom, largest) */}
      <group position={[0, 1.8, 0]}>
        <mesh castShadow receiveShadow>
          <coneGeometry args={[2.0, 1.9, 8]} />
          <meshStandardMaterial color="#194726" roughness={0.8} />
        </mesh>
        {snowCovered && (
          <mesh position={[0, 0.25, 0]} castShadow>
            <coneGeometry args={[2.05, 0.6, 8]} />
            <meshStandardMaterial color="#f0f6ff" roughness={0.7} />
          </mesh>
        )}
      </group>

      {/* Pine Tier 2 (Middle) */}
      <group position={[0, 2.9, 0]}>
        <mesh castShadow receiveShadow>
          <coneGeometry args={[1.5, 1.6, 8]} />
          <meshStandardMaterial color="#1a532b" roughness={0.8} />
        </mesh>
        {snowCovered && (
          <mesh position={[0, 0.2, 0]} castShadow>
            <coneGeometry args={[1.54, 0.5, 8]} />
            <meshStandardMaterial color="#f0f6ff" roughness={0.7} />
          </mesh>
        )}
      </group>

      {/* Pine Tier 3 (Top) */}
      <group position={[0, 3.8, 0]}>
        <mesh castShadow receiveShadow>
          <coneGeometry args={[1.0, 1.4, 8]} />
          <meshStandardMaterial color="#216636" roughness={0.8} />
        </mesh>
        {snowCovered && (
          <mesh position={[0, 0.2, 0]} castShadow>
            <coneGeometry args={[1.04, 0.45, 8]} />
            <meshStandardMaterial color="#f0f6ff" roughness={0.7} />
          </mesh>
        )}
      </group>

      {/* Golden Star at the Top */}
      <mesh position={[0, 4.65, 0]} castShadow>
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffbe0b"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

export default ChristmasTree;

