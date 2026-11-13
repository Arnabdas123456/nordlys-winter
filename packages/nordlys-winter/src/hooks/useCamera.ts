import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { prefersReducedMotion } from "../utils/performance";

interface UseCameraOptions {
  enabled?: boolean;
  intensity?: number;
  speed?: number;
}

export function useCamera({
  enabled = true,
  intensity = 0.5,
  speed = 0.4
}: UseCameraOptions = {}) {
  const targetPos = useRef(new THREE.Vector3(0, 2.4, 7.2));

  useFrame(({ camera, clock, pointer }) => {
    if (!enabled || prefersReducedMotion()) return;

    const t = clock.getElapsedTime() * speed;

    // Gentle cinematic swaying combined with interactive mouse parallax
    const targetX = Math.sin(t) * 0.8 * intensity + pointer.x * 1.5;
    const targetY = 2.4 + Math.cos(t * 0.7) * 0.3 * intensity - pointer.y * 0.6;
    const targetZ = 7.2 + Math.sin(t * 0.5) * 0.6 * intensity;

    camera.position.lerp(targetPos.current.set(targetX, targetY, targetZ), 0.04);
    camera.lookAt(0, 1.8, 0);
  });
}
