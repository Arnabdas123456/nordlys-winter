import { defineConfig } from "tsup";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  target: "es2022",
  external: [
    "react",
    "react-dom",
    "three",
    "@react-three/fiber",
    "@react-three/drei"
  ],
  onSuccess: async () => {
    const srcCss = path.resolve(__dirname, "src/styles/index.css");
    const distCss = path.resolve(__dirname, "dist/styles.css");
    if (fs.existsSync(srcCss)) {
      if (!fs.existsSync(path.resolve(__dirname, "dist"))) {
        fs.mkdirSync(path.resolve(__dirname, "dist"), { recursive: true });
      }
      fs.copyFileSync(srcCss, distCss);
    }
  }
});

