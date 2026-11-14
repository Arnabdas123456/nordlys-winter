"use client";

import React, { useRef, useState, useMemo, useEffect, useCallback, Suspense } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Snowman as PkgSnowman } from "nordlys-winter";

export interface SnowmanProps {
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  animate?: boolean;
  waving?: boolean;
  onDragChange?: (dragging: boolean) => void;
  onPositionSave?: (position: [number, number, number]) => void;
  onClick?: () => void;
}

const DEFAULT_POSITION: [number, number, number] = [0, -0.82, 1.8];
const DEFAULT_ROTATION: [number, number, number] = [0, 0, 0];
const MAX_DRAG_TURN_RAD = THREE.MathUtils.degToRad(13); // Subtle 10-15 degree directional turn while dragging
const RETURN_DAMP_LAMBDA = 9.0; // Smooth ~98% return to front-facing within 400-600ms
const TURN_DAMP_LAMBDA = 14.0;
const DRAG_TURN_VELOCITY_GAIN = 0.00042;

function GLBSnowman({
  position = DEFAULT_POSITION,
  scale = 0.35,
  rotation = DEFAULT_ROTATION,
  animate = true,
  onDragChange,
  onPositionSave,
  onClick
}: SnowmanProps) {
  const { scene } = useGLTF("/models/snowman.glb");
  const { camera, gl } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const rotationGroupRef = useRef<THREE.Group>(null);
  const shadowMeshRef = useRef<THREE.Mesh>(null);
  const jumpTimeRef = useRef<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Lock original orientation when model loads so SnowmanRoot never rotates
  const lockedRotationRef = useRef(
    new THREE.Euler(rotation[0] ?? 0, rotation[1] ?? 0, rotation[2] ?? 0)
  );

  // Direct mouse/touch drag refs (Three.js Raycaster + camera-facing drag plane)
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const hoveringRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const dragStartScreenRef = useRef({ x: 0, y: 0 });
  const prevPointerXRef = useRef(0);
  const prevPointerYRef = useRef(0);
  const prevMoveTimeRef = useRef(0);
  const lastHorizMoveTimeRef = useRef(0);
  const targetTurnYRef = useRef(0);
  const dragPlaneRef = useRef(new THREE.Plane());
  const dragOffsetRef = useRef(new THREE.Vector3());
  const dragTargetWorldPosRef = useRef(new THREE.Vector3(...position));
  const dragTargetLocalPosRef = useRef(new THREE.Vector3(...position));
  const restingPosRef = useRef(new THREE.Vector3(...position));
  const raycasterRef = useRef(new THREE.Raycaster());
  const ndcVecRef = useRef(new THREE.Vector2());
  const hitPointRef = useRef(new THREE.Vector3());
  const camDirRef = useRef(new THREE.Vector3());

  // Respect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const rotX = rotation[0] ?? 0;
  const rotY = rotation[1] ?? 0;
  const rotZ = rotation[2] ?? 0;

  // Keep locked rotation synchronized only with explicit initial rotation prop (never pointer/drag)
  useEffect(() => {
    lockedRotationRef.current.set(rotX, rotY, rotZ);
    if (groupRef.current) {
      groupRef.current.rotation.copy(lockedRotationRef.current);
    }
  }, [rotX, rotY, rotZ]);

  // Sync position prop when updated externally (e.g. initial hydrate, resize, or Reset Snowman Position)
  useEffect(() => {
    if (isDraggingRef.current) return;
    restingPosRef.current.set(position[0], position[1], position[2]);
    dragTargetLocalPosRef.current.set(position[0], position[1], position[2]);
    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1], position[2]);
      groupRef.current.rotation.copy(lockedRotationRef.current);
    }
  }, [position]);

  // Normalize model pivot so base is at Y=0 and center is at X=0, Z=0
  const normalizedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clone as any);
    const center = box.getCenter(new THREE.Vector3());

    // Shift clone inside wrapper so bottom is exactly at Y=0 and centered in X & Z
    clone.position.x = -center.x;
    clone.position.z = -center.z;
    clone.position.y = -box.min.y;

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Contact shadow is rendered via procedural shadowAssets plane; disable heavy dynamic shadow maps
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });

    const wrapper = new THREE.Group();
    wrapper.add(clone as any);
    return wrapper;
  }, [scene]);

  const finishDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    targetTurnYRef.current = 0;

    if (activePointerIdRef.current !== null) {
      try {
        gl.domElement.releasePointerCapture?.(activePointerIdRef.current);
      } catch {
        // Ignore if capture was already released
      }
      activePointerIdRef.current = null;
    }

    if (gl.domElement) {
      gl.domElement.style.touchAction = "auto";
    }

    onDragChange?.(false);

    if (typeof document !== "undefined") {
      document.body.style.cursor = hoveringRef.current ? "pointer" : "auto";
    }

    if (didDragRef.current) {
      const p = dragTargetLocalPosRef.current;
      restingPosRef.current.copy(p);
      if (groupRef.current) {
        groupRef.current.position.copy(p);
        groupRef.current.rotation.copy(lockedRotationRef.current);
      }
      onPositionSave?.([
        Number(p.x.toFixed(3)),
        Number(p.y.toFixed(3)),
        Number(p.z.toFixed(3))
      ]);
    }
  }, [gl.domElement, onDragChange, onPositionSave]);

  // Window-level pointermove / pointerup / pointercancel listeners while actively dragging
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      if (
        activePointerIdRef.current !== null &&
        typeof e.pointerId === "number" &&
        e.pointerId !== activePointerIdRef.current
      ) {
        return;
      }

      const now = performance.now();
      const dt = Math.max(0.004, Math.min(0.05, (now - prevMoveTimeRef.current) / 1000));
      const deltaX = e.clientX - prevPointerXRef.current;
      const deltaY = e.clientY - prevPointerYRef.current;
      prevPointerXRef.current = e.clientX;
      prevPointerYRef.current = e.clientY;
      prevMoveTimeRef.current = now;

      // Directional turn responds ONLY to horizontal pointer delta (ignores pure vertical drags & micro-jitter)
      if (!reducedMotion && Math.abs(deltaX) >= 1.0 && Math.abs(deltaX) >= Math.abs(deltaY) * 0.25) {
        const horizVelocity = deltaX / dt;
        targetTurnYRef.current = THREE.MathUtils.clamp(
          horizVelocity * DRAG_TURN_VELOCITY_GAIN,
          -MAX_DRAG_TURN_RAD,
          MAX_DRAG_TURN_RAD
        );
        lastHorizMoveTimeRef.current = now;
      }

      const dx = e.clientX - dragStartScreenRef.current.x;
      const dy = e.clientY - dragStartScreenRef.current.y;
      if (dx * dx + dy * dy > 16) {
        didDragRef.current = true;
      }

      const rect = gl.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      // Keep placement within the visible viewport
      const ndcX = Math.max(-0.92, Math.min(0.92, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      const ndcY = Math.max(-0.95, Math.min(0.75, -((e.clientY - rect.top) / rect.height) * 2 + 1));

      ndcVecRef.current.set(ndcX, ndcY);
      raycasterRef.current.setFromCamera(ndcVecRef.current, camera as unknown as THREE.Camera);
      if (raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, hitPointRef.current)) {
        dragTargetWorldPosRef.current.copy(hitPointRef.current).add(dragOffsetRef.current);
        dragTargetLocalPosRef.current.copy(dragTargetWorldPosRef.current);
        if (groupRef.current?.parent) {
          groupRef.current.parent.worldToLocal(dragTargetLocalPosRef.current as never);
        }
      }
    };

    const handleWindowPointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      if (
        activePointerIdRef.current !== null &&
        typeof e.pointerId === "number" &&
        e.pointerId !== activePointerIdRef.current
      ) {
        return;
      }
      finishDrag();
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: true });
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);
    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
    };
  }, [camera, gl.domElement, finishDrag, reducedMotion]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!groupRef.current) return;

    // Cancel any active jump so the snowman never jumps when grabbed
    jumpTimeRef.current = null;
    const initialWorldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(initialWorldPos as never);

    // Build invisible camera-facing drag plane passing through the snowman's initial position
    camera.getWorldDirection(camDirRef.current as never);
    dragPlaneRef.current.setFromNormalAndCoplanarPoint(camDirRef.current, initialWorldPos);

    const rect = gl.domElement.getBoundingClientRect();
    const ndcX = rect.width > 0 ? ((e.clientX - rect.left) / rect.width) * 2 - 1 : 0;
    const ndcY = rect.height > 0 ? -((e.clientY - rect.top) / rect.height) * 2 + 1 : 0;

    ndcVecRef.current.set(ndcX, ndcY);
    raycasterRef.current.setFromCamera(ndcVecRef.current, camera as unknown as THREE.Camera);

    if (raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, hitPointRef.current)) {
      dragOffsetRef.current.copy(initialWorldPos).sub(hitPointRef.current);
    } else {
      dragOffsetRef.current.set(0, 0, 0);
    }

    dragTargetWorldPosRef.current.copy(initialWorldPos);
    dragTargetLocalPosRef.current.copy(groupRef.current.position as never);
    dragStartScreenRef.current = { x: e.clientX, y: e.clientY };
    prevPointerXRef.current = e.clientX;
    prevPointerYRef.current = e.clientY;
    prevMoveTimeRef.current = performance.now();
    lastHorizMoveTimeRef.current = 0;
    targetTurnYRef.current = 0;
    didDragRef.current = false;
    isDraggingRef.current = true;
    activePointerIdRef.current = typeof e.pointerId === "number" ? e.pointerId : null;

    if (activePointerIdRef.current !== null) {
      try {
        gl.domElement.setPointerCapture?.(activePointerIdRef.current);
      } catch {
        // Ignore if pointer capture is unsupported
      }
    }

    if (gl.domElement) {
      gl.domElement.style.touchAction = "none";
    }

    onDragChange?.(true);
    if (typeof document !== "undefined") {
      document.body.style.cursor = "grabbing";
    }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    finishDrag();
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    if (!reducedMotion) {
      jumpTimeRef.current = 0;
    }
    if (onClick) onClick();
  };

  const shadowAssets = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 122);
    grad.addColorStop(0, "rgba(15, 25, 55, 0.58)");
    grad.addColorStop(0.38, "rgba(18, 30, 65, 0.42)");
    grad.addColorStop(0.7, "rgba(20, 34, 72, 0.16)");
    grad.addColorStop(1, "rgba(20, 34, 72, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false
    });

    return { tex, mat };
  }, []);

  useEffect(() => {
    if (!shadowAssets) return;
    shadowAssets.tex.needsUpdate = true;
    return () => {
      shadowAssets.tex.dispose();
      shadowAssets.mat.dispose();
    };
  }, [shadowAssets]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const numScale = typeof scale === "number" ? scale : 0.35;

    // SnowmanRoot preserves its locked initial rotation; only RotationGroup turns temporarily around Y
    groupRef.current.rotation.copy(lockedRotationRef.current);

    if (rotationGroupRef.current) {
      const now = performance.now();
      const hasRecentHorizMove =
        isDraggingRef.current && !reducedMotion && now - lastHorizMoveTimeRef.current < 120;
      const desiredTurnY = hasRecentHorizMove ? targetTurnYRef.current : 0;
      const dampLambda = hasRecentHorizMove ? TURN_DAMP_LAMBDA : RETURN_DAMP_LAMBDA;

      const nextTurnY = THREE.MathUtils.damp(
        rotationGroupRef.current.rotation.y,
        desiredTurnY,
        dampLambda,
        delta
      );
      rotationGroupRef.current.rotation.set(
        0,
        desiredTurnY === 0 && Math.abs(nextTurnY) < 0.0005 ? 0 : nextTurnY,
        0
      );
    }

    // Smoothly follow drag target on the camera-facing plane while dragging (position only on SnowmanRoot)
    if (isDraggingRef.current) {
      const followAlpha = Math.min(1, 1 - Math.exp(-26 * delta));
      groupRef.current.position.lerp(dragTargetLocalPosRef.current, followAlpha);
      groupRef.current.scale.set(numScale, numScale, numScale);

      if (shadowMeshRef.current && shadowAssets) {
        const p = groupRef.current.position;
        shadowMeshRef.current.position.set(p.x, p.y + 0.005, p.z + 0.06);
        shadowMeshRef.current.scale.set(numScale * 2.9, numScale * 2.1, 1);
        shadowAssets.mat.opacity = 0.85;
      }
      return;
    }

    if (!animate || reducedMotion) return;
    const t = clock.getElapsedTime();

    // Interactive jump bounce on stationary click without React state updates per frame
    let jumpOffset = 0;
    let jumpScaleY = 1.0;
    if (jumpTimeRef.current !== null) {
      const nextJump = jumpTimeRef.current + delta * 3.8;
      if (nextJump > Math.PI) {
        jumpTimeRef.current = null;
      } else {
        jumpTimeRef.current = nextJump;
        jumpOffset = Math.sin(nextJump) * 0.65;
        jumpScaleY = 1.0 + Math.sin(nextJump * 2) * 0.08;
      }
    }

    // Keep feet firmly anchored at the snowman's resting position; subtle breathing scale only
    const rest = restingPosRef.current;
    groupRef.current.position.set(rest.x, rest.y + jumpOffset, rest.z);
    const idleBreatheY = 1.0 + Math.sin(t * 1.6) * 0.012;

    groupRef.current.scale.set(numScale, numScale * idleBreatheY * jumpScaleY, numScale);

    // Keep contact shadow anchored directly beneath the snowman
    if (shadowMeshRef.current && shadowAssets) {
      const jumpRatio = Math.min(1, jumpOffset / 0.65);
      const shadowFactor = 1.0 - jumpRatio * 0.28;
      shadowMeshRef.current.position.set(rest.x, rest.y + 0.005, rest.z + 0.06);
      shadowMeshRef.current.scale.set(
        numScale * 2.9 * shadowFactor,
        numScale * 2.1 * shadowFactor,
        1
      );
      shadowAssets.mat.opacity = 1.0 - jumpRatio * 0.55;
    }
  });

  const numScale = typeof scale === "number" ? scale : 0.35;
  const baseY = position[1] ?? -0.82;

  return (
    <group>
      {/* Soft contact shadow grounding the snowman onto the photographed snowy street */}
      {shadowAssets && (
        <mesh
          ref={shadowMeshRef}
          position={[position[0], baseY + 0.005, position[2] + 0.06]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[numScale * 2.9, numScale * 2.1, 1]}
          renderOrder={0}
        >
          <planeGeometry args={[1, 1]} />
          <primitive object={shadowAssets.mat} attach="material" />
        </mesh>
      )}

      {/* SnowmanPositionGroup: controls world position and mouse dragging */}
      <group
        name="SnowmanPositionGroup"
        ref={groupRef}
        position={position}
        rotation={rotation}
        scale={numScale}
        renderOrder={1}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMissed={() => {
          if (isDraggingRef.current) {
            finishDrag();
          }
        }}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          hoveringRef.current = true;
          if (!isDraggingRef.current && typeof document !== "undefined") {
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={() => {
          hoveringRef.current = false;
          if (!isDraggingRef.current && typeof document !== "undefined") {
            document.body.style.cursor = "auto";
          }
        }}
      >
        {/* SnowmanRotationGroup: temporary directional Y rotation while dragging, smoothly returning to front */}
        <group name="SnowmanRotationGroup" ref={rotationGroupRef}>
          <primitive object={normalizedScene} />
        </group>
        {/* Warm gentle key light specifically highlighting the Snowman's festive features */}
        <pointLight position={[0.2, 1.2, 1.4]} color="#fff7ed" intensity={1.7} distance={5.5} decay={2} />
      </group>
    </group>
  );
}

class ModelErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: unknown) {
    console.warn("Notice: /models/snowman.glb load fallback activated:", err);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function Snowman(props: SnowmanProps) {
  return (
    <ModelErrorBoundary fallback={<PkgSnowman {...props} />}>
      <Suspense fallback={null}>
        <GLBSnowman {...props} />
      </Suspense>
    </ModelErrorBoundary>
  );
}

if (typeof window !== "undefined") {
  useGLTF.preload("/models/snowman.glb");
}

export default Snowman;
