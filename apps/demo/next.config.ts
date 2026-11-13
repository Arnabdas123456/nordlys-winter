import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["nordlys-winter", "three"],
  reactStrictMode: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
