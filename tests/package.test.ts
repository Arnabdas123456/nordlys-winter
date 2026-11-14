import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("NPM Package Configuration", () => {
  const pkgPath = path.resolve(__dirname, "../packages/nordlys-winter/package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  it("should have correct package name and initial semantic version", () => {
    expect(pkg.name).toBe("nordlys-winter");
    expect(pkg.version).toMatch(/^1\.\d+\.\d+/);
    expect(pkg.private).toBe(false);
  });

  it("should declare valid entry points for ESM, CJS, and types", () => {
    expect(pkg.main).toBe("./dist/index.js");
    expect(pkg.module).toBe("./dist/index.mjs");
    expect(pkg.types).toBe("./dist/index.d.ts");
    expect(pkg.exports["."]).toBeDefined();
    expect(pkg.exports["."].types).toBe("./dist/index.d.ts");
    expect(pkg.exports["."].import).toBe("./dist/index.mjs");
    expect(pkg.exports["."].require).toBe("./dist/index.js");
    expect(pkg.exports["./styles.css"]).toBe("./dist/styles.css");
  });

  it("should configure React and Three.js as peer dependencies", () => {
    expect(pkg.peerDependencies).toBeDefined();
    expect(pkg.peerDependencies.react).toBeDefined();
    expect(pkg.peerDependencies["react-dom"]).toBeDefined();
    expect(pkg.peerDependencies.three).toBeDefined();
    expect(pkg.peerDependencies["@react-three/fiber"]).toBeDefined();
  });

  it("should restrict published files to dist, README, and LICENSE", () => {
    expect(pkg.files).toContain("dist");
    expect(pkg.files).toContain("README.md");
    expect(pkg.files).toContain("LICENSE");
    expect(pkg.files).not.toContain("apps");
    expect(pkg.files).not.toContain("tests");
  });
});
