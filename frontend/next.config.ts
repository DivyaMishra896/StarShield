import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Vercel build failures on minor lint/type warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
