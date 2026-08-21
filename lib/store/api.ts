// ============================================================================
// Store data layer — the single integration seam for commerce.
//
// TODAY:   reads a static catalog (data/products.json) produced by the
//          Python scraper, so the rebuilt store pages render real products.
//
// LATER:   swap the internals of these functions to call the live commerce
//          API (Wix Stores REST/GraphQL, Shopify Storefront, etc.). The
//          return types (Product / ProductCategory) stay the same, so no UI
//          component needs to change. Set STORE_SOURCE via env to switch.
// ============================================================================

import type { Product, ProductCategory } from "./types";
import catalog from "@/data/products.json";

const STORE_SOURCE = process.env.NEXT_PUBLIC_STORE_SOURCE ?? "static";

const staticProducts = catalog as unknown as Product[];

export async function getProducts(): Promise<Product[]> {
  if (STORE_SOURCE === "static") {
    return staticProducts;
  }

  // TODO(commerce): fetch from the live catalog, e.g.
  //   const res = await fetch(`${process.env.STORE_API_URL}/products`, { ... });
  //   return normalizeToProducts(await res.json());
  throw new Error(
    `Store source "${STORE_SOURCE}" not implemented yet. ` +
      `Wire this up in lib/store/api.ts.`
  );
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getCategories(): Promise<ProductCategory[]> {
  const products = await getProducts();
  const counts = new Map<string, number>();

  for (const product of products) {
    for (const category of product.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([name, productCount]) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      productCount,
    }))
    .sort((a, b) => b.productCount - a.productCount);
}
