import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project (a stray lockfile exists in ~).
  outputFileTracingRoot: __dirname,
  sassOptions: {
    // Silence deprecation noise and let partials @use the abstracts cleanly.
    quietDeps: true,
  },
  images: {
    // Images are downloaded locally into /public/images by the Python scraper,
    // but allow the Wix CDN as a fallback while the migration is in progress.
    remotePatterns: [
      { protocol: "https", hostname: "static.wixstatic.com" },
    ],
  },
};

export default nextConfig;
