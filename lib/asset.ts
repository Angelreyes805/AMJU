// Prefix a public asset path with the deployment base path.
//
// GitHub Pages serves this project under /AMJU. Next.js applies basePath to
// <Link> and _next assets automatically, but NOT to string `src` values on
// <img>/next/image or anything read from data at runtime. This helper closes
// that gap for every image path.
//
//   local dev  -> NEXT_PUBLIC_BASE_PATH unset  -> asset("/images/x") = "/images/x"
//   Pages CI   -> NEXT_PUBLIC_BASE_PATH=/AMJU   -> asset("/images/x") = "/AMJU/images/x"
//
// NEXT_PUBLIC_* vars are inlined at build time, so this works in client and
// server components alike.

const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export function asset(path: string): string {
  if (!path) return path;
  // Leave absolute URLs (e.g. the Wix CDN fallback) untouched.
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
