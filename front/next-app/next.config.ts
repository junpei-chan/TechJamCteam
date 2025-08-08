import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CSS最適化を調整
  experimental: {
    optimizeCss: false, // lightningcssの問題を回避
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8006',
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8006',
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: '10.79.10.139',
        port: '8006',
        pathname: '/static/**',
      },
      // 開発環境での任意のlocalhostポートを許可
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/static/**',
      },
    ],
    // 画像の最適化を無効にする場合
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
