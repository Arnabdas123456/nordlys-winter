import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { ChristmasBellProps } from "../types";

export function ChristmasBell({
  position = [0, 0, 0],
  scale = 1,
  color = "#ffd700",
  swingSpeed = 2.0,
  swingAngle = 0.25,
  onClick
}: ChristmasBellProps) {
  const bellHingeRef = useRef<THREE.Group>(null);
  const clapperRef = useRef<THREE.Mesh>(null);
  const [chimeTime, setChimeTime] = useState<number | null>(null);

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setChimeTime(0);
    if (onClick) onClick();
  };

  useFrame(({ clock }, delta) => {
    let extraSwing = 0;
    if (chimeTime !== null) {
      const next = chimeTime + delta * 6;
      if (next > Math.PI * 2) {
        setChimeTime(null);
      } else {
        setChimeTime(next);
        extraSwing = Math.sin(next * 2) * 0.4;
      }
    }

    const t = clock.getElapsedTime() * swingSpeed;

    // Bell swinging motion from the top anchor point
    if (bellHingeRef.current) {
      bellHingeRef.current.rotation.z = Math.sin(t) * swingAngle + extraSwing;
    }

    // Clapper counters-swaying inside
    if (clapperRef.current) {
      clapperRef.current.rotation.z = -Math.sin(t) * (swingAngle * 1.3) - extraSwing * 1.2;
    }
  });

  return (
    <group
      position={position}
      scale={scale}
      onClick={handleClick}
      onPointerOver={() => {
        if (typeof document !== "undefined") document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        if (typeof document !== "undefined") document.body.style.cursor = "auto";
      }}
    >
      {/* Hanging Loop / Ribbon */}
      <mesh position={[0, 0.45, 0]}>
        <torusGeometry args={[0.08, 0.02, 12, 24]} />
        <meshStandardMaterial color="#c52222" roughness={0.4} />
      </mesh>

      {/* Bell Pivot / Hinge */}
      <group ref={bellHingeRef} position={[0, 0.4, 0]}>
        {/* Main Bell Body */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.28, 0.38, 24]} />
          <meshStandardMaterial
            color={color}
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Bell Lip / Rim */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <torusGeometry args={[0.27, 0.04, 16, 32]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Clapper inside the bell */}
        <mesh ref={clapperRef} position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial
            color="#b38f00"
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

export default ChristmasBell;

