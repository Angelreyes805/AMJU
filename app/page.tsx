import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/store/api";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import type { Product } from "@/lib/store/types";
import ProductGrid from "@/components/ProductGrid/ProductGrid";

function priceLabel(p: Product): string {
  return p.price != null ? `$${p.price.toFixed(2)}` : "";
}

export default async function HomePage() {
  const products = await getProducts();
  const withImage = products.filter((p) => p.images[0]?.src);

  // Featured product hero — the live site leads with PG Monument EX.
  const featured =
    withImage.find((p) => /monument ex/i.test(p.name)) ?? withImage[0];
  const grid = withImage.filter((p) => p.slug !== featured?.slug);

  return (
    <div className="home">
      {/* Flat-rate shipping strip (verbatim from the live site). */}
      <div className="home__shipping">{site.shippingBanner}</div>

      {/* Featured product hero */}
      {featured && (
        <section className="featured">
          <div className="u-container featured__inner">
            <div className="featured__media">
              <Image
                className="featured__img"
                src={asset(featured.images[0].src)}
                alt={featured.images[0].alt ?? featured.name}
                width={640}
                height={640}
                priority
              />
            </div>
            <div className="featured__content">
              <p className="u-eyebrow">Featured Product</p>
              <h1 className="featured__title">{featured.name}</h1>
              {featured.price != null && (
                <p className="featured__price">{priceLabel(featured)}</p>
              )}
              <p className="featured__text">
                A wide variety of Gundam/Mecha models, collectibles, building
                blocks, supplies and more. There is something for everyone.
              </p>
              <div className="featured__actions">
                <Link
                  href={`/shop/${featured.slug}`}
                  className="btn btn--accent btn--lg"
                >
                  View Details
                </Link>
                <Link href="/shop" className="btn btn--outline btn--lg">
                  Shop All Products
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product grid */}
      <section className="section">
        <div className="u-container">
          <div className="home__intro">
            <p className="u-eyebrow">Shop</p>
            <h2>New &amp; Featured</h2>
            <p className="home__intro-text">
              Hand-picked kits and collectibles from our latest inventory.
            </p>
          </div>

          <ProductGrid products={grid.slice(0, 12)} />

          <div className="home__cta">
            <Link href="/shop" className="btn btn--primary btn--lg">
              Browse the Full Store
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
