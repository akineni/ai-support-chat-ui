import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs:  false,
      };
    }

    if (dev) {
      config.watchOptions = {
        poll:             2000,
        aggregateTimeout: 500,
        ignored:          ['**/node_modules/**', '**/.next/**'],
      };
    }

    return config;
  },
};

export default nextConfig;