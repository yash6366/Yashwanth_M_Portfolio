/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    qualities: [75, 80, 85, 95, 100],
  },
};

export default nextConfig;
