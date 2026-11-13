import React, { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import type { NordlysSceneProps } from "./types";
import { QUALITY_CONFIGS, isWebGLAvailable } from "./utils/performance";
import { initThreeLogger } from "./utils/timer";
import { Snowfall } from "./components/Snowfall";
import { Snowman } from "./components/Snowman";
import { ChristmasTree } from "./components/ChristmasTree";
import { ChristmasLights } from "./components/ChristmasLights";
import { ChristmasBell } from "./components/ChristmasBell";
import { AuroraEnvironment } from "./components/AuroraEnvironment";
import { WinterGround } from "./components/WinterGround";
import { useCamera } from "./hooks/useCamera";

function SceneRig({
  cameraMovement = true,
  children
}: {
  cameraMovement?: boolean;
  children: React.ReactNode;
}) {
  useCamera({ enabled: cameraMovement });
  return <>{children}</>;
}

export function NordlysScene({
  theme = "nordlys",
  aurora = true,
  auroraIntensity = 1.0,
  auroraSpeed = 0.4,
  stars = true,
  snowfall = true,
  snowDensity = 3000,
  snowSpeed,
  snowSpeedLevel = 3,
  windStrength = 0.35,
  blizzardMode = false,
  showSnowman = true,
  showChristmasTrees = true,
  showChristmasLights = false,
  showChristmasBells = false,
  showCabins = false,
  showGround = true,
  showMoon = false,
  cameraMovement = true,
  quality = "high",
  className = "",
  style = {},
  fallback,
  children
}: NordlysSceneProps) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    initThreeLogger();
    setMounted(true);
    setHasWebGL(isWebGLAvailable());
  }, []);

  const qualityConfig = QUALITY_CONFIGS[quality] || QUALITY_CONFIGS.high;
  const effectiveSnowCount = Math.floor(snowDensity * qualityConfig.particleMultiplier);

  // Fallback for SSR or non-WebGL environments
  if (!mounted || !hasWebGL) {
    return (
      <div
        className={`nordlys-fallback relative flex items-center justify-center overflow-hidden ${className}`}
        style={{ width: "100%", height: "100%", minHeight: "100vh", ...style }}
      >
        {fallback || (
          <div className="text-center p-8 text-white z-10">
            <h3 className="text-2xl font-bold tracking-widest uppercase text-emerald-300">
              Nordlys
            </h3>
            <p className="text-sm text-blue-200 mt-2">
              {hasWebGL
                ? "Where the Northern Lights come alive..."
                : "WebGL is not enabled on this device."}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`nordlys-container relative w-full h-full overflow-hidden ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "transparent",
        ...style
      }}
    >
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
          background: "transparent"
        }}
        camera={{ position: [0, 1.45, 7.0], fov: 45 }}
        dpr={qualityConfig.dpr}
        shadows={qualityConfig.shadows ? { type: THREE.PCFShadowMap } : false}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          if (gl.shadowMap) {
            gl.shadowMap.type = THREE.PCFShadowMap;
          }
        }}
        gl={{
          alpha: true,
          premultipliedAlpha: true,
          antialias: qualityConfig.antialias,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          <SceneRig cameraMovement={cameraMovement}>
            {/* 1. Arctic Sky Atmosphere: Stars, Procedural Tromso Aurora & Lighting */}
            <AuroraEnvironment
              theme={theme}
              aurora={aurora}
              auroraIntensity={auroraIntensity}
              auroraSpeed={auroraSpeed}
              stars={stars}
              showMoon={showMoon}
              quality={quality}
            />

            {/* 2. Soft Ground Snow Bank */}
            {showGround && <WinterGround hasLake={false} />}

            {/* 3. High-Performance Snowfall Particle System */}
            {snowfall && (
              <Snowfall
                count={effectiveSnowCount}
                speed={snowSpeed}
                speedLevel={snowSpeedLevel}
                wind={windStrength}
                blizzardMode={blizzardMode}
              />
            )}

            {/* 4. Pine Trees framing the Arctic landscape */}
            {showChristmasTrees && (
              <group>
                <ChristmasTree position={[-3.2, -0.6, -1.0]} scale={1.25} />
                <ChristmasTree position={[3.2, -0.6, -1.2]} scale={1.2} />
              </group>
            )}

            {/* 5. Optional Tree Fairy Lights */}
            {showChristmasLights && showChristmasTrees && (
              <ChristmasLights position={[-3.2, -0.6, -1.0]} count={28} radius={1.6} height={3.6} />
            )}

            {/* 6. Optional Christmas Bells */}
            {showChristmasBells && (
              <group>
                <ChristmasBell position={[-3.2, 3.2, -0.2]} scale={0.85} swingSpeed={2.2} />
                <ChristmasBell position={[3.2, 3.0, -0.4]} scale={0.75} swingSpeed={1.8} color="#f9c74f" />
              </group>
            )}

            {/* 7. Optional Distant Nordic Cabin */}
            {showCabins && (
              <group position={[-7.5, -0.6, -6.5]} rotation={[0, 0.4, 0]} scale={0.8}>
                <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                  <boxGeometry args={[4.5, 3.0, 3.8]} />
                  <meshStandardMaterial color="#3d2314" roughness={0.9} />
                </mesh>
                <mesh position={[0, 3.7, 0]} castShadow>
                  <coneGeometry args={[3.6, 2.0, 4]} />
                  <meshStandardMaterial color="#f0f6ff" roughness={0.7} />
                </mesh>
                <mesh position={[0.8, 1.6, 1.92]}>
                  <planeGeometry args={[1.0, 1.0]} />
                  <meshBasicMaterial color="#ffbe0b" />
                </mesh>
                <pointLight position={[0.8, 1.6, 2.2]} color="#ffbe0b" intensity={1.2} distance={6} />
              </group>
            )}

            {/* 8. Interactive Snowman Character */}
            {showSnowman && (
              <Snowman position={[0, -0.6, 0]} scale={1.05} animate={true} waving={true} />
            )}

            {children}
          </SceneRig>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default NordlysScene;
