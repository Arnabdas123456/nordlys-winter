import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface WinterAnimationOptions {
  speed?: number;
  amplitude?: number;
  offset?: number;
}

export function useWinterAnimation({
  speed = 1.0,
  amplitude = 1.0,
  offset = 0
}: WinterAnimationOptions = {}) {
  const valueRef = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    valueRef.current = Math.sin(t) * amplitude;
  });

  return valueRef;
}

