import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["nordlys-winter", "three"],
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "nordlys-winter/styles.css": path.resolve(__dirname, "../../packages/nordlys-winter/src/styles/index.css"),
      "nordlys-winter": path.resolve(__dirname, "../../packages/nordlys-winter/src/index.ts")
    };
    return config;
  }
};

export default nextConfig;
