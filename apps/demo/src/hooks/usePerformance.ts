"use client";

import { useEffect, useState } from "react";
import type { QualityPreset } from "../types";
import { prefersReducedMotion } from "nordlys-winter";

export function usePerformance() {
  const [recommendedQuality, setRecommendedQuality] = useState<QualityPreset>("high");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // Check device specs
    const userAgent = navigator.userAgent || "";
    const mobileCheck = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
    setIsMobile(mobileCheck);

    const concurrency = navigator.hardwareConcurrency || 4;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;

    if (mobileCheck || concurrency <= 2 || memory <= 2) {
      setRecommendedQuality("low");
    } else if (concurrency <= 4 || memory <= 4) {
      setRecommendedQuality("medium");
    } else {
      setRecommendedQuality("high");
    }

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return {
    recommendedQuality,
    reducedMotion,
    isMobile
  };
}

export default usePerformance;

