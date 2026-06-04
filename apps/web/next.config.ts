import path from "path";
import type { NextConfig } from "next";

const monorepoRoot = path.join(__dirname, "../..");

const nextConfig: NextConfig = {
  transpilePackages: ["@web-hoc-stripe/shared"],
  // Monorepo: bundle workspace + prisma from repo root on Vercel/Render
  outputFileTracingRoot: monorepoRoot,
};

export default nextConfig;
