/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  output: "standalone",
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
