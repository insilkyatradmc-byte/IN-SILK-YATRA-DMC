/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  typescript: {
    // Ignore TypeScript errors during build (Lucide React type compatibility issue)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Optimize for better performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // optimizeCss disabled to avoid missing 'critters' dependency in dev
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ['framer-motion', 'lucide-react', '@react-three/fiber', '@react-three/drei'],
  },
  // Optimize font loading
  optimizeFonts: true,
  // Reduce animation complexity for better performance
  modularizeImports: {
    'framer-motion': {
      transform: 'framer-motion/dist/es/{{member}}',
    },
  },
}

module.exports = nextConfig
