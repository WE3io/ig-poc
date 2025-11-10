import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Fix for paths with special characters (like apostrophes)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Disable metadata route processing for favicon to avoid path issues
  experimental: {
    // This helps avoid issues with special characters in paths
  },
};

export default nextConfig;
