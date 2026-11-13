import * as THREE from "three";

/**
 * Traverses an Object3D and cleans up its geometries, materials, and textures.
 */
export function disposeObject(object: THREE.Object3D | null | undefined): void {
  if (!object) return;

  object.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
      if (child.geometry) {
        child.geometry.dispose();
      }

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => disposeMaterial(mat));
        } else {
          disposeMaterial(child.material);
        }
      }
    }
  });
}

function disposeMaterial(material: THREE.Material): void {
  material.dispose();

  for (const key of Object.keys(material)) {
    const value = (material as unknown as Record<string, unknown>)[key];
    if (value && typeof value === "object" && "isTexture" in value) {
      (value as THREE.Texture).dispose();
    }
  }
}

