import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { AuroraStarsProps } from "../types";
import { prefersReducedMotion } from "../utils/performance";

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function AuroraStars({
  count = 650,
  active = true,
  twinkleSpeed = 1.2,
  quality = "high"
}: AuroraStarsProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const effectiveCount = useMemo(() => {
    if (quality === "low") return Math.max(120, Math.floor(count * 0.45));
    if (quality === "medium") return Math.max(250, Math.floor(count * 0.75));
    return count;
  }, [count, quality]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(effectiveCount * 3);
    const colors = new Float32Array(effectiveCount * 3);
    const phases = new Float32Array(effectiveCount);
    const sizes = new Float32Array(effectiveCount);

    for (let i = 0; i < effectiveCount; i++) {
      const i3 = i * 3;
      const u = seededRandom(i * 3 + 1);
      const v = seededRandom(i * 3 + 2);
      const rRand = seededRandom(i * 3 + 3);

      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 48 + rRand * 20;

      const sinPhi = Math.sin(phi);
      positions[i3] = r * sinPhi * Math.cos(theta);
      // Keep stars strictly in the upper night sky above the village rooftops
      positions[i3 + 1] = Math.abs(r * Math.cos(phi)) * 0.85 + 11.5;
      positions[i3 + 2] = r * sinPhi * Math.sin(theta);

      const tint = seededRandom(i * 5 + 7);
      if (tint > 0.82) {
        // Warm golden starlight
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.92;
        colors[i3 + 2] = 0.76;
      } else if (tint > 0.45) {
        // Icy turquoise-cyan tint
        colors[i3] = 0.78;
        colors[i3 + 1] = 0.96;
        colors[i3 + 2] = 1.0;
      } else {
        // Crisp Arctic white
        colors[i3] = 0.96;
        colors[i3 + 1] = 0.98;
        colors[i3 + 2] = 1.0;
      }

      phases[i] = seededRandom(i * 7 + 11) * Math.PI * 2.0;
      sizes[i] = 1.3 + seededRandom(i * 11 + 13) * 2.4;
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geom.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geom.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return geom;
  }, [effectiveCount]);

  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uTwinkleSpeed: { value: twinkleSpeed }
      },
      vertexShader: /* glsl */ `
        attribute float aPhase;
        attribute float aSize;
        uniform float uTime;
        uniform float uTwinkleSpeed;
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
          vColor = color;
          vTwinkle = 0.65 + 0.35 * sin(uTime * uTwinkleSpeed + aPhase);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (220.0 / max(1.0, -mvPosition.z));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          float glow = pow(1.0 - dist * 2.0, 1.8);
          gl_FragColor = vec4(vColor, glow * vTwinkle * 0.9);
        }
      `
    });
    materialRef.current = mat;
    return mat;
  }, [twinkleSpeed]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock }) => {
    if (!active || !materialRef.current || prefersReducedMotion()) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  if (!active) return null;

  return <points geometry={geometry} material={material} renderOrder={-3} />;
}

export default AuroraStars;

