/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  // Railway specific settings
  output: "standalone",
};

module.exports = nextConfig;
