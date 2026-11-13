import { describe, it, expect } from "vitest";
import * as Pkg from "../packages/nordlys-winter/src/index";

describe("nordlys-winter Package Exports", () => {
  it("should export the main NordlysScene component", () => {
    expect(Pkg.NordlysScene).toBeDefined();
    expect(typeof Pkg.NordlysScene).toBe("function");
    expect(Pkg.default).toBe(Pkg.NordlysScene);
  });

  it("should export procedural Norway Aurora components and shader utilities", () => {
    expect(typeof Pkg.AuroraShader).toBe("function");
    expect(typeof Pkg.AuroraRibbons).toBe("function");
    expect(typeof Pkg.AuroraStars).toBe("function");
    expect(typeof Pkg.AuroraEnvironment).toBe("function");
    expect(typeof Pkg.createAuroraShaderMaterial).toBe("function");
    expect(Pkg.AURORA_VERTEX_SHADER).toContain("uTime");
    expect(Pkg.AURORA_FRAGMENT_SHADER).toContain("uIntensity");
    expect(Pkg.AURORA_FRAGMENT_SHADER).toContain("fbm");
  });

  it("should create a valid Aurora ShaderMaterial with required uniforms", () => {
    const mat = Pkg.createAuroraShaderMaterial({
      intensity: 1.0,
      speed: 0.4,
      quality: "high"
    });
    expect(mat.uniforms.uTime).toBeDefined();
    expect(mat.uniforms.uIntensity.value).toBe(1.0);
    expect(mat.uniforms.uSpeed.value).toBe(0.4);
    expect(mat.uniforms.uColorPrimary).toBeDefined();
    expect(mat.uniforms.uColorSecondary).toBeDefined();
    expect(mat.uniforms.uColorAccent).toBeDefined();
    expect(mat.uniforms.uResolution).toBeDefined();
    mat.dispose();
  });

  it("should map aurora intensity levels cleanly including zero invisibility", () => {
    for (const level of [0, 0.25, 0.5, 0.75, 1.0]) {
      const mat = Pkg.createAuroraShaderMaterial({ intensity: level });
      expect(mat.uniforms.uIntensity.value).toBe(level);
      mat.dispose();
    }
    expect(Pkg.AURORA_FRAGMENT_SHADER).toContain("intensityVal <= 0.001");
  });

  it("should export individual 3D winter primitives", () => {
    expect(typeof Pkg.Snowfall).toBe("function");
    expect(typeof Pkg.Snowman).toBe("function");
    expect(typeof Pkg.ChristmasTree).toBe("function");
    expect(typeof Pkg.ChristmasLights).toBe("function");
    expect(typeof Pkg.ChristmasBell).toBe("function");
    expect(typeof Pkg.WinterGround).toBe("function");
  });

  it("should export custom hooks", () => {
    expect(typeof Pkg.useSnowfall).toBe("function");
    expect(typeof Pkg.useCamera).toBe("function");
    expect(typeof Pkg.useWinterAnimation).toBe("function");
  });

  it("should export utility functions and quality configs", () => {
    expect(typeof Pkg.isWebGLAvailable).toBe("function");
    expect(typeof Pkg.prefersReducedMotion).toBe("function");
    expect(typeof Pkg.disposeObject).toBe("function");
    expect(Pkg.QUALITY_CONFIGS).toBeDefined();
    expect(Pkg.QUALITY_CONFIGS.low.particleMultiplier).toBeLessThan(Pkg.QUALITY_CONFIGS.high.particleMultiplier);
  });
});
