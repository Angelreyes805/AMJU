import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // -- GitHub Pages static export ------------------------------------------
  // The Pages workflow (actions/configure-pages, static_site_generator: next)
  // ALSO injects these plus basePath/assetPrefix (/AMJU) at build time. Setting
  // them here makes `next build` reproduce the same static export locally.
  output: "export",
  // Serve sub-pages as /about/ -> about/index.html (reliable on GitHub Pages).
  trailingSlash: true,
  // Pin the workspace root to this project (a stray lockfile exists in ~).
  outputFileTracingRoot: __dirname,
  sassOptions: {
    // Silence deprecation noise and let partials @use the abstracts cleanly.
    quietDeps: true,
  },
  images: {
    // Required for `output: export` — no server-side optimization on Pages.
    // next/image still applies basePath, which fixes the broken /images paths.
    unoptimized: true,
  },
};

export default nextConfig;
