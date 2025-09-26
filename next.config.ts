import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  // Ensure app listens on all interfaces for Railway
  output: process.env.RAILWAY_ENVIRONMENT ? "standalone" : undefined,

  webpack: (config: any) => {
    config.optimization.splitChunks = {
      chunks: "all",
      maxInitialRequests: 1,
      maxAsyncRequests: 1,
      cacheGroups: {
        default: {
          minChunks: 1,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
      },
    };
    return config;
  },
};

export default nextConfig;
