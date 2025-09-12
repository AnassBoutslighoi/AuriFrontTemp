/** @type {import('next').NextConfig} */
const nextConfig = {
  // Re-enable ESLint during builds
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Re-enable TypeScript build errors
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
