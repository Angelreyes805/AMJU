# AMJ Unlimited — Website Rebuild

A faithful [Next.js](https://nextjs.org) + BEM/SCSS recreation of
[amjunlimited.com](https://www.amjunlimited.com) (a Wix Gundam/mecha hobby
store), deployed as a static export to GitHub Pages.

**Live:** https://angelreyes805.github.io/AMJU/

## Stack
- **Next.js 15** (App Router, TypeScript), static export (`output: "export"`)
- **SCSS** in a 7-1 architecture with **BEM** naming (`styles/`)
- Fonts via `next/font` — Montserrat/Jost (free substitutes for the licensed
  Wix Avenir/Futura)
- **Python** scrapers pull content + images from the live Wix site

## Project layout
```
app/                Routes (App Router) — one folder per page
components/          Reusable UI (Header, Footer, ProductCard, Prose, …)
lib/                site config, store data-layer, asset() helper, blog
data/               Scraped content (products.json, pages/, blog/, videos.json)
public/images/      Downloaded images (brand, home, products, blog)
styles/             7-1 BEM SCSS (abstracts/base/layout/components/pages)
scripts/            Python scrapers
```

## Develop
```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # static export -> ./out
```

## Scrapers
Re-pull content/images from the live site (requires `pip install --user
requests beautifulsoup4`):
```bash
npm run scrape:pages      # About, Shipping, Privacy, Terms, Cookies, Contact
npm run scrape:products   # full 806-product catalog (via sitemap) -> data/products.json
npm run scrape:videos     # /livestream YouTube embeds -> data/videos.json
npm run scrape:blog        # blog posts -> data/blog/
npm run scrape             # marketing-page images -> public/images/
```

## Deployment (GitHub Pages)
- Pushing to `main` triggers `.github/workflows/nextjs.yml`.
- `actions/configure-pages` injects `basePath: /AMJU`. Because that basePath is
  **not** applied to string image `src`, all image paths go through
  `lib/asset.ts` `asset()`, fed by `NEXT_PUBLIC_BASE_PATH` (the Pages
  `base_path` output). See `lib/asset.ts` for details.

## Store integration (future)
The store UI reads from `lib/store/api.ts` (`getProducts` / `getProductBySlug`)
which currently returns the scraped static catalog. Swap the internals to the
live commerce API (Wix/Shopify/custom) to enable real cart/checkout — no UI
changes required. Cart/checkout buttons are intentionally non-functional until
then.
