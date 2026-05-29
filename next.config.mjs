/** @type {import('next').NextConfig} */
const nextConfig = {
  serverActions: {
    bodySizeLimit: '50mb',
  },
  experimental: {
    middlewareClientMaxBodySize: '50mb',
  },
};

export default nextConfig;