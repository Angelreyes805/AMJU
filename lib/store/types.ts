// Store domain types. These are intentionally provider-agnostic so the
// data layer (lib/store/api.ts) can be backed by static scraped data now
// and swapped to the live commerce API (Wix / Shopify / custom) later
// without touching the UI components.

export interface ProductImage {
  /** Local path under /public (populated by the Python scraper). */
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  /** Price in USD. Null until wired to the live catalog. */
  price: number | null;
  compareAtPrice?: number | null;
  currency: string;
  images: ProductImage[];
  categories: string[];
  inStock: boolean;
  /** Canonical URL of the product on the current live site. */
  sourceUrl?: string;
}

export interface ProductCategory {
  slug: string;
  name: string;
  productCount: number;
}
