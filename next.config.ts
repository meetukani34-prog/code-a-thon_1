import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/student',
        destination: '/portal',
        permanent: true,
      },
      {
        source: '/faculty',
        destination: '/portal',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/portal',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
