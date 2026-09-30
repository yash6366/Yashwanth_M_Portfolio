/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    qualities: [75, 80, 85, 95, 100],
  },
  async rewrites() {
    return [
      {
        source: '/resume',
        destination: '/api/resume',
      },
      {
        source: '/resume.pdf',
        destination: '/api/resume',
      },
      {
        source: '/resume/YASHWANTH-M-Resume.pdf',
        destination: '/api/resume',
      },
    ]
  },
};

export default nextConfig;
