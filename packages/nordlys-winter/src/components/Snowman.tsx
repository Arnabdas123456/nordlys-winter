import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { SnowmanProps } from "../types";

export function Snowman({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  animate = true,
  waving = true,
  onClick
}: SnowmanProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const scarfTailRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  // Jump bounce animation trigger on click (stored in ref to avoid per-frame React re-renders)
  const jumpTimeRef = useRef<number | null>(null);

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    jumpTimeRef.current = 0;
    if (onClick) onClick();
  };

  useFrame(({ clock }, delta) => {
    if (!animate) return;
    const t = clock.getElapsedTime();

    // Handle interactive click jump bounce
    let jumpOffset = 0;
    if (jumpTimeRef.current !== null) {
      const nextJump = jumpTimeRef.current + delta * 3;
      if (nextJump > Math.PI) {
        jumpTimeRef.current = null;
      } else {
        jumpTimeRef.current = nextJump;
        jumpOffset = Math.sin(nextJump) * 0.8;
      }
    }

    // Subtle gentle breathing / idle bobbing + jump
    if (groupRef.current) {
      groupRef.current.position.y = (position[1] || 0) + Math.sin(t * 1.5) * 0.04 + jumpOffset;
    }

    // Head tilt and nodding
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.2) * 0.12;
      headRef.current.rotation.z = Math.cos(t * 0.8) * 0.05;
    }

    // Friendly arm waving (faster during jump)
    if (rightArmRef.current) {
      if (waving || jumpTimeRef.current !== null) {
        const waveSpeed = jumpTimeRef.current !== null ? 8.0 : 4.0;
        rightArmRef.current.rotation.z = -0.5 + Math.sin(t * waveSpeed) * 0.35;
        rightArmRef.current.rotation.x = Math.cos(t * waveSpeed) * 0.15;
      } else {
        rightArmRef.current.rotation.z = -0.3 + Math.sin(t * 1.0) * 0.05;
      }
    }

    // Left arm subtle idle sway
    if (leftArmRef.current) {
      const leftWaveSpeed = jumpTimeRef.current !== null ? 8.0 : 1.2;
      leftArmRef.current.rotation.z = 0.3 + Math.sin(t * leftWaveSpeed) * 0.15;
    }

    // Scarf tail fluttering in the winter wind
    if (scarfTailRef.current) {
      scarfTailRef.current.rotation.x = 0.2 + Math.sin(t * 3.5) * 0.15;
      scarfTailRef.current.rotation.y = Math.cos(t * 2.8) * 0.1;
    }

    // Cute periodic eye blinking
    const blinkCycle = t % 4.5;
    const isBlinking = blinkCycle > 4.35 && blinkCycle < 4.5;
    const eyeScaleY = isBlinking ? 0.1 : 1.0;
    if (leftEyeRef.current) leftEyeRef.current.scale.y = eyeScaleY;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = eyeScaleY;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={() => {
        if (typeof document !== "undefined") document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        if (typeof document !== "undefined") document.body.style.cursor = "auto";
      }}
    >
      {/* 1. Base Snowball */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#f4f8fc"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Middle Snowball (Torso) */}
      <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial
          color="#f4f8fc"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Coal Buttons on Torso */}
      {[
        [0, 2.55, 0.86],
        [0, 2.25, 0.89],
        [0, 1.95, 0.85]
      ].map((pos, idx) => (
        <mesh key={`button-${idx}`} position={pos as [number, number, number]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#1f1f1f" roughness={0.6} metalness={0.2} />
        </mesh>
      ))}

      {/* Red Scarf around neck */}
      <group position={[0, 2.95, 0]}>
        <mesh castShadow>
          <torusGeometry args={[0.62, 0.12, 16, 32]} />
          <meshStandardMaterial color="#c52222" roughness={0.6} />
        </mesh>
        {/* Scarf Tail */}
        <mesh
          ref={scarfTailRef}
          position={[0.3, -0.3, 0.48]}
          rotation={[0.2, 0, -0.2]}
          castShadow
        >
          <boxGeometry args={[0.2, 0.65, 0.06]} />
          <meshStandardMaterial color="#b31b1b" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm (Branch with twig) */}
      <group ref={rightArmRef} position={[0.8, 2.35, 0]} rotation={[0, 0, -0.5]}>
        <mesh position={[0.65, 0, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 1.3, 8]} />
          <meshStandardMaterial color="#53351d" roughness={0.9} />
        </mesh>
        {/* Branch twig */}
        <mesh position={[0.95, 0.25, 0]} rotation={[0, 0, 0.6]} castShadow>
          <cylinderGeometry args={[0.025, 0.035, 0.45, 8]} />
          <meshStandardMaterial color="#53351d" roughness={0.9} />
        </mesh>
      </group>

      {/* Left Arm (Branch with twig) */}
      <group ref={leftArmRef} position={[-0.8, 2.35, 0]} rotation={[0, 0, 0.4]}>
        <mesh position={[-0.65, 0, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 1.3, 8]} />
          <meshStandardMaterial color="#53351d" roughness={0.9} />
        </mesh>
        {/* Branch twig */}
        <mesh position={[-0.95, 0.25, 0]} rotation={[0, 0, -0.6]} castShadow>
          <cylinderGeometry args={[0.025, 0.035, 0.45, 8]} />
          <meshStandardMaterial color="#53351d" roughness={0.9} />
        </mesh>
      </group>

      {/* 3. Head Group */}
      <group ref={headRef} position={[0, 3.4, 0]}>
        {/* Head Snowball */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshStandardMaterial
            color="#f4f8fc"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* Orange Carrot Nose */}
        <mesh
          position={[0, 0.02, 0.65]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <coneGeometry args={[0.11, 0.65, 16]} />
          <meshStandardMaterial color="#ff6b08" roughness={0.5} />
        </mesh>

        {/* Left Eye */}
        <mesh ref={leftEyeRef} position={[-0.2, 0.18, 0.58]} castShadow>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Right Eye */}
        <mesh ref={rightEyeRef} position={[0.2, 0.18, 0.58]} castShadow>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Smiling Coal Mouth */}
        {[
          [-0.22, -0.16, 0.55],
          [-0.11, -0.22, 0.58],
          [0, -0.24, 0.6],
          [0.11, -0.22, 0.58],
          [0.22, -0.16, 0.55]
        ].map((pos, idx) => (
          <mesh key={`mouth-${idx}`} position={pos as [number, number, number]} castShadow>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#222222" roughness={0.6} />
          </mesh>
        ))}

        {/* Black Top Hat */}
        <group position={[0, 0.52, 0]}>
          {/* Hat Brim */}
          <mesh castShadow>
            <cylinderGeometry args={[0.75, 0.75, 0.06, 32]} />
            <meshStandardMaterial color="#18181b" roughness={0.5} metalness={0.2} />
          </mesh>
          {/* Red Hat Ribbon */}
          <mesh position={[0, 0.12, 0]} castShadow>
            <cylinderGeometry args={[0.49, 0.49, 0.14, 32]} />
            <meshStandardMaterial color="#d12229" roughness={0.4} />
          </mesh>
          {/* Hat Crown */}
          <mesh position={[0, 0.48, 0]} castShadow>
            <cylinderGeometry args={[0.47, 0.45, 0.7, 32]} />
            <meshStandardMaterial color="#18181b" roughness={0.5} metalness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default Snowman;
