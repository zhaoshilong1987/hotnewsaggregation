import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['*.dev.coze.site'],
  // 启用压缩以减少传输大小
  compress: true,
  images: {
    unoptimized: false, // 启用图片优化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lf3-static.bytednsdoc.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
