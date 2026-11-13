"use client";

import React, { useEffect, useMemo, Suspense } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { NordlysScene } from "nordlys-winter";
import { useWinterStore } from "../../stores/winter-store";
import { Snowman } from "./Snowman";
import {
  getCameraLayoutConfig,
  computeCalibratedSnowmanTransform
} from "../../lib/snowman-layout";

interface WinterSceneProps {
  onSceneReady?: () => void;
}

// Responsive camera framing aligned to the Christmas village photograph horizon & street perspective
function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!camera || !("fov" in camera)) return;
    const pCam = camera as unknown as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(1, size.height);
    const config = getCameraLayoutConfig(aspect);

    pCam.fov = config.fov;
    pCam.position.set(...config.camPos);
    pCam.lookAt(...config.lookAt);
    pCam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

// Fires onSceneReady after Suspense items have loaded and rendered their first frame
function SceneReadyNotifier({ onSceneReady }: { onSceneReady?: () => void }) {
  useEffect(() => {
    let active = true;
    const rafId = requestAnimationFrame(() => {
      if (active && onSceneReady) {
        onSceneReady();
      }
    });
    return () => {
      active = false;
      cancelAnimationFrame(rafId);
    };
  }, [onSceneReady]);

  return null;
}

function ResponsiveSceneContent({ onSceneReady }: { onSceneReady?: () => void }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);

  const { snowmanPosition, setIsDraggingSnowman, saveSnowmanPosition } = useWinterStore();

  const defaultTransform = useMemo(() => {
    const config = getCameraLayoutConfig(aspect);
    return computeCalibratedSnowmanTransform(aspect, config);
  }, [aspect]);

  const activePosition = snowmanPosition ?? defaultTransform.position;

  return (
    <Suspense fallback={null}>
      {/* Layer 5: Directly draggable 3D GLB Snowman anchored onto the snowy village street */}
      <Snowman
        position={activePosition}
        scale={defaultTransform.scale}
        animate={true}
        waving={true}
        onDragChange={setIsDraggingSnowman}
        onPositionSave={saveSnowmanPosition}
      />

      <SceneReadyNotifier onSceneReady={onSceneReady} />
    </Suspense>
  );
}

export function WinterScene({ onSceneReady }: WinterSceneProps) {
  const {
    northernLightsEnabled,
    auroraIntensity,
    snowfallEnabled,
    snowSpeedLevel,
    snowDensity,
    qualityPreset,
    hydrateSnowmanPosition
  } = useWinterStore();

  useEffect(() => {
    hydrateSnowmanPosition();
  }, [hydrateSnowmanPosition]);

  return (
    <NordlysScene
      theme="nordlys"
      aurora={northernLightsEnabled}
      auroraIntensity={auroraIntensity}
      auroraSpeed={0.4}
      stars={true}
      snowfall={snowfallEnabled}
      snowDensity={snowDensity}
      snowSpeedLevel={snowSpeedLevel}
      windStrength={0.35}
      blizzardMode={false}
      showSnowman={false}
      showChristmasTrees={false}
      showGround={false}
      showChristmasLights={false}
      showChristmasBells={false}
      showCabins={false}
      showMoon={false}
      cameraMovement={false}
      quality={qualityPreset}
      className="w-full h-full"
      fallback={<div className="w-full h-full" />}
    >
      <ResponsiveCamera />
      <ResponsiveSceneContent onSceneReady={onSceneReady} />
    </NordlysScene>
  );
}

export default WinterScene;
