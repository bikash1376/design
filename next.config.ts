import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is pre-rendered, so the site deploys as static assets.
  output: "export",
  outputFileTracingRoot: process.cwd(),
  devIndicators: false,
};

export default nextConfig;
