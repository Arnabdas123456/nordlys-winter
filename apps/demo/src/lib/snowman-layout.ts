import * as THREE from "three";

export const SNOWMAN_UNSCALED_HEIGHT = 2.5301;
export const SNOWMAN_TARGET_Z = 1.8;

export interface CameraLayoutConfig {
  fov: number;
  camPos: [number, number, number];
  lookAt: [number, number, number];
  ndcX: number;
  ndcY: number;
  screenHeightRatio: number;
}

export function getCameraLayoutConfig(aspect: number): CameraLayoutConfig {
  if (aspect < 0.72) {
    // Mobile portrait: feet on snowy road above floating music player & footer
    return {
      fov: 52,
      camPos: [0, 1.45, 7.6],
      lookAt: [0, 0.95, 0],
      ndcX: -0.06,
      ndcY: -0.72,
      screenHeightRatio: 0.175
    };
  }
  if (aspect < 1.15) {
    // Tablet / squarish viewport: feet on snowy road in lower-center
    return {
      fov: 48,
      camPos: [0, 1.45, 7.3],
      lookAt: [0, 0.95, 0],
      ndcX: 0.02,
      ndcY: -0.8,
      screenHeightRatio: 0.185
    };
  }
  // Desktop widescreen (1920x1080, 1366x768): feet squarely on central foreground snowy street
  return {
    fov: 45,
    camPos: [0, 1.45, 7.0],
    lookAt: [0, 0.95, 0],
    ndcX: 0.04,
    ndcY: -0.82,
    screenHeightRatio: 0.195
  };
}

export function computeCalibratedSnowmanTransform(
  aspect: number,
  config: CameraLayoutConfig = getCameraLayoutConfig(aspect)
): { position: [number, number, number]; scale: number } {
  const safeAspect = Number.isFinite(aspect) && aspect > 0 ? aspect : 16 / 9;
  const virtualCam = new THREE.PerspectiveCamera(config.fov, safeAspect, 0.1, 100);
  virtualCam.position.set(...config.camPos);
  virtualCam.lookAt(...config.lookAt);
  virtualCam.updateMatrixWorld();
  virtualCam.updateProjectionMatrix();

  const rayOrigin = virtualCam.position.clone();
  const rayTarget = new THREE.Vector3(config.ndcX, config.ndcY, 0.5).unproject(virtualCam);
  const dir = rayTarget.sub(rayOrigin).normalize();
  const t = (SNOWMAN_TARGET_Z - rayOrigin.z) / dir.z;
  const worldAnchor = rayOrigin.add(dir.multiplyScalar(t));

  const dz = config.camPos[2] - SNOWMAN_TARGET_Z;
  const frustumHeight = 2 * dz * Math.tan(THREE.MathUtils.degToRad(config.fov * 0.5));
  const scale = (config.screenHeightRatio * frustumHeight) / SNOWMAN_UNSCALED_HEIGHT;

  return {
    position: [
      Number(worldAnchor.x.toFixed(3)),
      Number(worldAnchor.y.toFixed(3)),
      SNOWMAN_TARGET_Z
    ],
    scale: Number(scale.toFixed(3))
  };
}

