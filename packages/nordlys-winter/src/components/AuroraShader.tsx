import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { AuroraShaderProps, QualityPreset } from "../types";
import { prefersReducedMotion } from "../utils/performance";

export const AURORA_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uLayerOffset;
  uniform float uWaveFrequency;
  uniform float uWaveAmplitude;

  varying vec2 vUv;
  varying float vCrest;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float t = uTime * uSpeed;

    // Smooth curtain fold deformation along the arc without rigid rotation
    float wave1 = sin(pos.x * uWaveFrequency + t * 0.55 + uLayerOffset) * uWaveAmplitude;
    float wave2 = cos(pos.x * (uWaveFrequency * 1.85) - t * 0.38 + uLayerOffset * 2.1) * (uWaveAmplitude * 0.45);
    float verticalSwell = sin(pos.x * (uWaveFrequency * 0.75) + t * 0.3 + uLayerOffset) * (uWaveAmplitude * 0.35);

    // Stronger displacement toward the upper/middle ribbon for natural hanging curtain physics
    float heightWeight = smoothstep(0.0, 0.75, uv.y);
    pos.z += (wave1 + wave2) * (0.45 + 0.55 * heightWeight);
    pos.y += verticalSwell * heightWeight;

    vCrest = clamp((wave1 + wave2) / max(0.001, uWaveAmplitude * 1.5) * 0.5 + 0.5, 0.0, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const AURORA_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uSpeed;
  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;
  uniform vec3 uColorAccent;
  uniform vec3 uColorNorthern;
  uniform vec3 uColorTurquoise;
  uniform vec3 uColorMidnight;
  uniform vec2 uResolution;
  uniform float uLayerOffset;
  uniform float uOpacity;
  uniform float uOctaves;

  varying vec2 vUv;
  varying float vCrest;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    // Quintic smooth interpolation for artifact-free gradients
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(37.2, 19.8);
    mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);

    for (int i = 0; i < 4; i++) {
      if (float(i) >= uOctaves) break;
      value += amplitude * valueNoise(p);
      p = rot * p * 2.03 + shift;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    float intensityVal = max(0.0, uIntensity);
    if (intensityVal <= 0.001) discard;

    vec2 uv = vUv;

    // Early boundary discard to eliminate fragment shader workload outside visible curtain bounds
    float horizFade = smoothstep(0.0, 0.20, uv.x) * smoothstep(1.0, 0.80, uv.x);
    if (horizFade <= 0.004) discard;
    if (uv.y <= 0.015 || uv.y >= 0.985) discard;

    float t = uTime * uSpeed;

    // 1. Domain-warped organic curtain structure (continuous horizontal & vertical drift)
    float macroFlow = fbm(vec2(uv.x * 2.5 - t * 0.13 + uLayerOffset, uv.y * 0.9 + t * 0.035));
    float microFlow = uOctaves > 2.5
      ? fbm(vec2(uv.x * 5.8 + t * 0.17 + macroFlow * 1.35, uv.y * 1.9 - t * 0.065))
      : valueNoise(vec2(uv.x * 4.2 + t * 0.15 + macroFlow, uv.y * 1.6 - t * 0.05));

    // 2. Vertically waving light rays shimmering along the magnetic curtain
    float raySway = sin(uv.y * 3.2 - t * 0.75 + uLayerOffset) * 0.28;
    float rayCoordX = uv.x * 16.5 + macroFlow * 2.6 + microFlow * 1.05 + raySway;
    float raysBroad = valueNoise(vec2(rayCoordX - t * 0.16, uv.y * 0.38 - t * 0.12 + uLayerOffset));
    float raysSharp = valueNoise(vec2(rayCoordX * 2.25 + t * 0.24, uv.y * 0.62 - t * 0.18));
    float rayMask = smoothstep(0.2, 0.92, raysBroad * 0.6 + raysSharp * 0.4);

    // 3. Undulating lower curtain edge & soft upper atmospheric fade (prevents flat horizontal strip)
    float edgeWave = sin(uv.x * 5.2 + t * 0.42 + uLayerOffset) * 0.055
                   + cos(uv.x * 8.6 - t * 0.29 + uLayerOffset * 1.7) * 0.028;
    float baseEdge = 0.08 + macroFlow * 0.22 + edgeWave;

    float lowerSkirt = smoothstep(baseEdge - 0.04, baseEdge + 0.09, uv.y);
    float normalizedH = clamp((uv.y - baseEdge) / max(0.06, 1.0 - baseEdge), 0.0, 1.0);
    float upperFade = pow(1.0 - normalizedH, 1.55);

    // Natural variation in curtain brightness across the sky
    float brightBurst = 0.5 + 0.8 * smoothstep(0.3, 0.86, microFlow);
    float curtainDensity = lowerSkirt * upperFade * horizFade * (0.28 + 0.92 * rayMask) * brightBurst;

    // Subtle soft atmospheric scatter envelope
    float atmosphericScatter = lowerSkirt * pow(1.0 - normalizedH, 1.15) * horizFade * macroFlow * 0.26;

    // 4. Norwegian Aurora Borealis Color Gradient (emerald -> cyan/turquoise -> subtle purple/violet)
    vec3 lowerEmerald = mix(uColorNorthern, uColorPrimary, smoothstep(0.15, 0.75, rayMask));
    vec3 midTurquoise = mix(uColorSecondary, uColorTurquoise, smoothstep(0.2, 0.85, microFlow));
    vec3 upperViolet = mix(uColorAccent, uColorMidnight, smoothstep(0.72, 1.0, normalizedH));

    vec3 auroraColor = mix(lowerEmerald, midTurquoise, smoothstep(0.12, 0.48, normalizedH));
    auroraColor = mix(auroraColor, upperViolet, smoothstep(0.45, 0.88, normalizedH));

    // Subtle brightness boost along vibrant curtain crests
    auroraColor += uColorPrimary * pow(curtainDensity, 2.0) * 0.3 * (0.6 + 0.4 * vCrest);

    // Perceptual intensity scaling: 0% invisible, 25% subtle glow, 50% green, 75% bright emerald, 100% vivid realistic
    float alphaIntensity = pow(intensityVal, 1.3);
    float glowIntensity = mix(0.42, 1.22, clamp(intensityVal, 0.0, 1.0)) + max(0.0, intensityVal - 1.0) * 0.25;
    auroraColor *= glowIntensity;

    // Slight softening behind central hero title while keeping sky curtains luminous
    float centerMask = 1.0 - 0.18 * exp(-pow((uv.x - 0.5) * 3.4, 2.0)) * (1.0 - smoothstep(0.35, 0.75, normalizedH));

    // Asymptotic compression prevents premature saturation so 50%, 75%, and 100% stay visibly distinct
    float rawAlpha = (curtainDensity + atmosphericScatter) * uOpacity * alphaIntensity * centerMask;
    float finalAlpha = (1.0 - exp(-rawAlpha * 1.45)) * 0.90;
    if (finalAlpha < 0.002) discard;

    gl_FragColor = vec4(auroraColor, finalAlpha);
  }
`;

export function getAuroraOctaves(quality: QualityPreset): number {
  if (quality === "low") return 2;
  if (quality === "medium") return 3;
  return 4;
}

export function createAuroraShaderMaterial({
  intensity = 1.0,
  speed = 0.4,
  colorPrimary = "#00FF80",
  colorSecondary = "#25E5D1",
  colorAccent = "#7555D9",
  colorBase = "#06101F",
  layerOffset = 0,
  waveFrequency = 0.14,
  waveAmplitude = 1.6,
  opacity = 0.85,
  quality = "high"
}: AuroraShaderProps = {}): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.SrcAlphaFactor,
    blendDst: THREE.OneFactor,
    blendEquationAlpha: THREE.AddEquation,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: intensity },
      uSpeed: { value: speed },
      uColorPrimary: { value: new THREE.Color(colorPrimary) },
      uColorSecondary: { value: new THREE.Color(colorSecondary) },
      uColorAccent: { value: new THREE.Color(colorAccent) },
      uColorNorthern: { value: new THREE.Color("#00D978") },
      uColorTurquoise: { value: new THREE.Color("#71F5D5") },
      uColorMidnight: { value: new THREE.Color(colorBase) },
      uResolution: { value: new THREE.Vector2(1920, 1080) },
      uLayerOffset: { value: layerOffset },
      uWaveFrequency: { value: waveFrequency },
      uWaveAmplitude: { value: waveAmplitude },
      uOpacity: { value: opacity },
      uOctaves: { value: getAuroraOctaves(quality) }
    },
    vertexShader: AURORA_VERTEX_SHADER,
    fragmentShader: AURORA_FRAGMENT_SHADER
  });
}

export function AuroraShader({
  intensity = 1.0,
  speed = 0.4,
  colorPrimary = "#00FF80",
  colorSecondary = "#25E5D1",
  colorAccent = "#7555D9",
  colorBase = "#06101F",
  layerOffset = 0,
  waveFrequency = 0.14,
  waveAmplitude = 1.6,
  opacity = 0.85,
  quality = "high",
  active = true
}: AuroraShaderProps) {
  const { size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const latestUniformsRef = useRef({
    active,
    intensity,
    speed,
    colorPrimary,
    colorSecondary,
    colorAccent,
    colorBase,
    layerOffset,
    waveFrequency,
    waveAmplitude,
    opacity,
    quality
  });

  latestUniformsRef.current = {
    active,
    intensity,
    speed,
    colorPrimary,
    colorSecondary,
    colorAccent,
    colorBase,
    layerOffset,
    waveFrequency,
    waveAmplitude,
    opacity,
    quality
  };

  const material = useMemo(() => {
    const mat = createAuroraShaderMaterial({
      intensity: active ? intensity : 0,
      speed,
      colorPrimary,
      colorSecondary,
      colorAccent,
      colorBase,
      layerOffset,
      waveFrequency,
      waveAmplitude,
      opacity,
      quality
    });
    return mat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  materialRef.current = material;

  // Update scalar/color uniforms cleanly without recreating the ShaderMaterial
  useEffect(() => {
    const mat = materialRef.current;
    if (!mat) return;
    const u = mat.uniforms;
    u.uIntensity.value = active ? intensity : 0;
    u.uSpeed.value = speed;
    u.uColorPrimary.value.set(colorPrimary);
    u.uColorSecondary.value.set(colorSecondary);
    u.uColorAccent.value.set(colorAccent);
    u.uColorMidnight.value.set(colorBase);
    u.uLayerOffset.value = layerOffset;
    u.uWaveFrequency.value = waveFrequency;
    u.uWaveAmplitude.value = waveAmplitude;
    u.uOpacity.value = opacity;
    u.uOctaves.value = getAuroraOctaves(quality);
  }, [
    active,
    intensity,
    speed,
    colorPrimary,
    colorSecondary,
    colorAccent,
    colorBase,
    layerOffset,
    waveFrequency,
    waveAmplitude,
    opacity,
    quality
  ]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [size.width, size.height]);

  useEffect(() => {
    material.needsUpdate = true;
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame(({ clock }) => {
    const mat = materialRef.current;
    if (!mat) return;
    const p = latestUniformsRef.current;
    mat.uniforms.uIntensity.value = p.active ? p.intensity : 0;
    mat.uniforms.uSpeed.value = p.speed;
    mat.uniforms.uOpacity.value = p.opacity;
    mat.uniforms.uOctaves.value = getAuroraOctaves(p.quality);

    if (!p.active || p.intensity <= 0.001 || prefersReducedMotion()) return;
    mat.uniforms.uTime.value = clock.getElapsedTime();
  });

  return <primitive object={material} attach="material" />;
}

export default AuroraShader;

