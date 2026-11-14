"use client";

import React, { useEffect, useMemo, useRef, Suspense } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
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

// Lightweight adaptive performance monitor: steps down quality on sustained low frame rates
function AdaptivePerformanceWatcher() {
  const { qualityPreset, stepDownQuality, stepUpQuality } = useWinterStore();
  const lastCheckTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const consecutiveLowFpsCountRef = useRef(0);
  const consecutiveHighFpsCountRef = useRef(0);
  const lastQualityChangeTimeRef = useRef(performance.now());

  useFrame(() => {
    if (qualityPreset !== "auto") return;
    frameCountRef.current++;
    const now = performance.now();
    const elapsed = now - lastCheckTimeRef.current;

    // Evaluate every 1.5s
    if (elapsed >= 1500) {
      const fps = (frameCountRef.current / elapsed) * 1000;
      frameCountRef.current = 0;
      lastCheckTimeRef.current = now;

      // Minimum 8s cooldown between automatic quality adjustments to prevent rapid flapping
      if (now - lastQualityChangeTimeRef.current < 8000) return;

      if (fps < 27) {
        consecutiveLowFpsCountRef.current++;
        consecutiveHighFpsCountRef.current = 0;
        if (consecutiveLowFpsCountRef.current >= 2) {
          stepDownQuality();
          lastQualityChangeTimeRef.current = now;
          consecutiveLowFpsCountRef.current = 0;
        }
      } else if (fps >= 56) {
        consecutiveHighFpsCountRef.current++;
        consecutiveLowFpsCountRef.current = 0;
        if (consecutiveHighFpsCountRef.current >= 4) {
          stepUpQuality();
          lastQualityChangeTimeRef.current = now;
          consecutiveHighFpsCountRef.current = 0;
        }
      } else {
        consecutiveLowFpsCountRef.current = 0;
        consecutiveHighFpsCountRef.current = 0;
      }
    }
  });

  return null;
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

      <AdaptivePerformanceWatcher />
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
    effectiveQuality,
    initDeviceCapability,
    hydrateSnowmanPosition
  } = useWinterStore();

  useEffect(() => {
    initDeviceCapability();
    hydrateSnowmanPosition();
  }, [initDeviceCapability, hydrateSnowmanPosition]);

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
      quality={effectiveQuality}
      className="w-full h-full"
      fallback={<div className="w-full h-full" />}
    >
      <ResponsiveCamera />
      <ResponsiveSceneContent onSceneReady={onSceneReady} />
    </NordlysScene>
  );
}

export default WinterScene;
