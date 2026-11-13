import React from "react";
import type { WinterGroundProps } from "../types";

export function WinterGround({
  size = 40,
  snowColor = "#f0f6fc",
  lakeColor = "#6ba4c8",
  hasLake = false
}: WinterGroundProps) {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Soft Ground Snow Bank */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size, 25, 16, 16]} />
        <meshStandardMaterial
          color={snowColor}
          roughness={0.85}
          metalness={0.05}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Gentle Snow Drift Mound behind the snowman */}
      <mesh position={[0, 0.1, -1.5]} scale={[4, 0.4, 2]} receiveShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={snowColor} roughness={0.8} />
      </mesh>

      {/* Optional Frozen Lake */}
      {hasLake && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0.02, 3]} receiveShadow>
          <circleGeometry args={[3.8, 32]} />
          <meshStandardMaterial
            color={lakeColor}
            roughness={0.18}
            metalness={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}
    </group>
  );
}

export default WinterGround;
