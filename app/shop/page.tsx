import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import { getProducts } from "@/lib/store/api";

export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="All Products"
        subtitle={`${products.length} Gundam/Mecha models, collectibles, building blocks, supplies and more.`}
      />
      <section className="section">
        <div className="u-container">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <p>
              Catalog is being populated — run <code>npm run scrape:products</code>.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
