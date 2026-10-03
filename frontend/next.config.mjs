/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Stability fixes: prevent static asset 404s and CSS loss after inactivity.
  // Root cause: next dev compiles chunks lazily in memory; they evict under
  // memory pressure (cpus:1 / workerThreads:false was starving the compiler).
  // Solution: always run `next build && next start` (production mode).
  // The settings below make the dev server more robust if used during development.
  poweredByHeader: false,
  compress: true,
  // Remove experimental flags that caused worker death under low-CPU quota
};

export default nextConfig;

