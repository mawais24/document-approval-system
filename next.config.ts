/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove this entire experimental block - Server Actions are stable now
  // experimental: {
  //   serverActions: true,  // This is causing the error
  // },

  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // Railway specific settings
  output: "standalone",

  // Add these for better deployment stability
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
