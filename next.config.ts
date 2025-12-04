import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Empty turbopack config (Next.js 16 default)
  turbopack: {},
  
  // Exclude backend from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
