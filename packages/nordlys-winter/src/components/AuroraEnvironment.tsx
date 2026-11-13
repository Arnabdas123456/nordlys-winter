import React from "react";
import type { AuroraEnvironmentProps } from "../types";
import { AuroraStars } from "./AuroraStars";
import { AuroraRibbons } from "./AuroraRibbons";

export function AuroraEnvironment({
  theme = "nordlys",
  aurora = true,
  auroraIntensity = 1.0,
  auroraSpeed = 0.4,
  stars = true,
  showMoon = false,
  quality = "high"
}: AuroraEnvironmentProps) {
  const shadowSize = quality === "low" ? 512 : 1024;
  const ambientColor = theme === "midnight" ? "#9ab8de" : "#c8e1ff";

  return (
    <group>
      {/* 1. Ambient Arctic Night Fill Light */}
      <ambientLight intensity={0.65} color={ambientColor} />

      {/* 2. Directional Moonlight Casting Soft Shadows onto the Snow */}
      <directionalLight
        position={[10, 16, 8]}
        intensity={1.25}
        color="#e2f0fd"
        castShadow={quality !== "low"}
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-bias={-0.0001}
      />

      {/* 3. Subtle Emerald-Cyan Aurora Sky Bounce Light */}
      {aurora && auroraIntensity > 0 && (
        <hemisphereLight
          args={["#25e5d1", "#06101f", 0.25 * Math.min(1.5, auroraIntensity)]}
        />
      )}

      {/* 4. Warm Foreground Holiday Key Glow */}
      <pointLight position={[0, 3.5, 2.5]} intensity={0.85} color="#fcd34d" distance={15} />

      {/* 5. Twinkling Arctic Night Sky Stars */}
      {stars && <AuroraStars active={stars} quality={quality} />}

      {/* 6. Procedural Tromso Aurora Borealis Light Curtains */}
      {aurora && (
        <AuroraRibbons
          active={aurora}
          intensity={auroraIntensity}
          speed={auroraSpeed}
          quality={quality}
        />
      )}

      {/* 7. Optional Arctic Moon */}
      {showMoon && (
        <group position={[-14, 18, -28]}>
          <mesh>
            <sphereGeometry args={[1.8, 28, 28]} />
            <meshBasicMaterial color="#fffbeb" />
          </mesh>
          <mesh>
            <sphereGeometry args={[2.5, 28, 28]} />
            <meshBasicMaterial color="#bae6fd" transparent opacity={0.16} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default AuroraEnvironment;

