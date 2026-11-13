"use client";

import * as THREE from "three";

/**
 * Configure Three.js logging using the official Three.js `setConsoleFunction` API.
 * Safely filters out the upstream `@react-three/fiber` internal `THREE.Clock` deprecation
 * notice in Three.js r187+ without monkey-patching global `console.warn`.
 */
export function initThreeLogger(): void {
  if (typeof (THREE as any).setConsoleFunction === "function") {
    (THREE as any).setConsoleFunction(
      (type: "log" | "warn" | "error", message: string, ...params: unknown[]) => {
        if (
          type === "warn" &&
          typeof message === "string" &&
          message.includes("Clock: This module has been deprecated")
        ) {
          return;
        }
        const fn = console[type] || console.log;
        fn(message, ...params);
      }
    );
  }
}

initThreeLogger();
