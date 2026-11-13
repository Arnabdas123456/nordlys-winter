import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { AuroraRibbonsProps, QualityPreset } from "../types";
import { AuroraShader } from "./AuroraShader";

interface RibbonLayerConfig {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  opacity: number;
  waveFrequency: number;
  waveAmplitude: number;
  layerOffset: number;
  speedMultiplier: number;
}

function createCurvedRibbonGeometry(
  width: number,
  height: number,
  segmentsX: number,
  segmentsY: number,
  curvature = 5.5
): THREE.PlaneGeometry {
  const geom = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
  const posAttr = geom.attributes.position;
  const halfW = width * 0.5;

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const normX = x / halfW;

    // Gentle S-curve & parabolic arc wrapping naturally across the northern sky
    const zCurve = normX * normX * curvature + Math.sin(normX * Math.PI) * 1.4;
    // Organic skyward arch so curtains sweep dynamically rather than forming a flat horizontal bar
    const yArch = (1.0 - normX * normX) * 0.65 + Math.sin(normX * Math.PI * 1.5) * 0.55;

    posAttr.setXYZ(i, x, y + yArch, zCurve);
  }

  posAttr.needsUpdate = true;
  geom.computeVertexNormals();
  return geom;
}

function getSegmentsForQuality(quality: QualityPreset): [number, number] {
  if (quality === "low") return [28, 8];
  if (quality === "medium") return [48, 12];
  return [72, 18];
}

function RibbonMesh({
  layer,
  segmentsX,
  segmentsY,
  intensity,
  speed,
  quality,
  active
}: {
  layer: RibbonLayerConfig;
  segmentsX: number;
  segmentsY: number;
  intensity: number;
  speed: number;
  quality: QualityPreset;
  active: boolean;
}) {
  const geometry = useMemo(
    () => createCurvedRibbonGeometry(layer.width, layer.height, segmentsX, segmentsY),
    [layer.width, layer.height, segmentsX, segmentsY]
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <mesh
      geometry={geometry}
      position={layer.position}
      rotation={layer.rotation}
      renderOrder={-2}
      frustumCulled={false}
    >
      <AuroraShader
        active={active}
        intensity={intensity}
        speed={speed * layer.speedMultiplier}
        colorPrimary={layer.colorPrimary}
        colorSecondary={layer.colorSecondary}
        colorAccent={layer.colorAccent}
        layerOffset={layer.layerOffset}
        waveFrequency={layer.waveFrequency}
        waveAmplitude={layer.waveAmplitude}
        opacity={layer.opacity}
        quality={quality}
      />
    </mesh>
  );
}

export function AuroraRibbons({
  active = true,
  intensity = 1.0,
  speed = 0.4,
  quality = "high",
  colorPrimary = "#00FF80",
  colorSecondary = "#25E5D1",
  colorAccent = "#7555D9",
  position = [0, 0, 0],
  scale = 1
}: AuroraRibbonsProps) {
  const [segmentsX, segmentsY] = getSegmentsForQuality(quality);

  const layers: RibbonLayerConfig[] = useMemo(() => {
    const allLayers: RibbonLayerConfig[] = [
      {
        id: "primary-emerald-curtain",
        position: [0, 6.1, -23],
        rotation: [0.16, 0.05, -0.04],
        width: 46,
        height: 8.6,
        colorPrimary,
        colorSecondary,
        colorAccent,
        opacity: 0.68,
        waveFrequency: 0.14,
        waveAmplitude: 1.5,
        layerOffset: 0.0,
        speedMultiplier: 1.0
      },
      {
        id: "secondary-turquoise-veil",
        position: [-1.4, 6.9, -27],
        rotation: [0.18, -0.06, 0.035],
        width: 52,
        height: 9.8,
        colorPrimary: "#00D978",
        colorSecondary: "#71F5D5",
        colorAccent,
        opacity: 0.52,
        waveFrequency: 0.11,
        waveAmplitude: 1.9,
        layerOffset: 2.6,
        speedMultiplier: 0.78
      },
      {
        id: "upper-violet-glow",
        position: [1.4, 7.6, -31],
        rotation: [0.2, 0.03, 0.02],
        width: 58,
        height: 10.8,
        colorPrimary: "#25E5D1",
        colorSecondary: "#71F5D5",
        colorAccent,
        opacity: 0.38,
        waveFrequency: 0.085,
        waveAmplitude: 2.2,
        layerOffset: 5.3,
        speedMultiplier: 0.58
      }
    ];

    if (quality === "low") return allLayers.slice(0, 1);
    if (quality === "medium") return allLayers.slice(0, 2);
    return allLayers;
  }, [quality, colorPrimary, colorSecondary, colorAccent]);

  const isVisible = active && intensity > 0.001;

  return (
    <group position={position} scale={scale} visible={isVisible}>
      {layers.map((layer) => (
        <RibbonMesh
          key={layer.id}
          layer={layer}
          segmentsX={segmentsX}
          segmentsY={segmentsY}
          intensity={intensity}
          speed={speed}
          quality={quality}
          active={active}
        />
      ))}
    </group>
  );
}

export default AuroraRibbons;