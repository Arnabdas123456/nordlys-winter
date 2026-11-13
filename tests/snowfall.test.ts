import { describe, it, expect } from "vitest";
import { randomRange, randomVectorInBox } from "../packages/nordlys-winter/src/utils/random";
import { QUALITY_CONFIGS } from "../packages/nordlys-winter/src/utils/performance";
import {
  SNOW_SPEED_LEVELS,
  getSnowSpeedFromLevel,
  MAX_SNOW_PARTICLES
} from "../packages/nordlys-winter/src/index";

describe("Snowfall & Particle Utilities", () => {
  it("randomRange generates numbers within range", () => {
    for (let i = 0; i < 50; i++) {
      const val = randomRange(5, 15);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThanOrEqual(15);
    }
  });

  it("randomVectorInBox generates points bounded by box dimensions", () => {
    const width = 40;
    const height = 25;
    const depth = 40;

    for (let i = 0; i < 50; i++) {
      const [x, y, z] = randomVectorInBox(width, height, depth);
      expect(Math.abs(x)).toBeLessThanOrEqual(width / 2);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(height);
      expect(Math.abs(z)).toBeLessThanOrEqual(depth / 2);
    }
  });

  it("quality presets scale particle densities properly", () => {
    const baseDensity = 3000;
    const lowCount = Math.floor(baseDensity * QUALITY_CONFIGS.low.particleMultiplier);
    const medCount = Math.floor(baseDensity * QUALITY_CONFIGS.medium.particleMultiplier);
    const highCount = Math.floor(baseDensity * QUALITY_CONFIGS.high.particleMultiplier);

    expect(lowCount).toBe(1200);
    expect(medCount).toBe(2250);
    expect(highCount).toBe(3000);
    expect(lowCount).toBeLessThan(medCount);
    expect(medCount).toBeLessThan(highCount);
  });

  it("all 10 snowfall speed levels exist and are strictly ascending", () => {
    expect(Object.keys(SNOW_SPEED_LEVELS).length).toBe(10);
    expect(MAX_SNOW_PARTICLES).toBe(10000);

    let prevSpeed = 0;
    for (let level = 1; level <= 10; level++) {
      const config = SNOW_SPEED_LEVELS[level];
      expect(config).toBeDefined();
      expect(config.speed).toBeGreaterThan(prevSpeed);
      expect(typeof config.label).toBe("string");
      expect(typeof config.description).toBe("string");
      prevSpeed = config.speed;
    }

    expect(SNOW_SPEED_LEVELS[1].label).toBe("Very Gentle");
    expect(SNOW_SPEED_LEVELS[10].label).toBe("Blizzard");
  });

  it("getSnowSpeedFromLevel maps levels correctly with boundary clamping", () => {
    expect(getSnowSpeedFromLevel(1)).toBe(0.4);
    expect(getSnowSpeedFromLevel(3)).toBe(1.0);
    expect(getSnowSpeedFromLevel(10)).toBe(6.5);

    // Clamping test
    expect(getSnowSpeedFromLevel(0)).toBe(0.4);
    expect(getSnowSpeedFromLevel(-5)).toBe(0.4);
    expect(getSnowSpeedFromLevel(15)).toBe(6.5);
  });
});
