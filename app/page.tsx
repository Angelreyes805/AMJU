import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/store/api";
import { site } from "@/lib/site";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 8);

  return (
    <div className="home">
      {/* Shipping strip — mirrors the live site's flat-rate banner. */}
      <div className="home__shipping">{site.shippingBanner}</div>

      {/* Hero */}
      <section className="hero">
        <div className="hero__media">
          <Image
            className="hero__img"
            src="/images/home/home-hero-01.jpg"
            alt="Gundam and mecha model kits"
            fill
            sizes="100vw"
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="hero__overlay" />
        <div className="hero__inner">
          <div className="hero__content">
            <p className="u-eyebrow">Gundam · Mecha · Collectibles</p>
            <h1 className="hero__title">Build something legendary.</h1>
            <p className="hero__text">
              A wide variety of Gundam/Mecha models, collectibles, building
              blocks, supplies and more. There is something for everyone.
            </p>
            <div className="hero__actions">
              <Link href="/shop" className="btn btn--accent btn--lg">
                Shop All Products
              </Link>
              <Link href="/livestream" className="btn btn--outline btn--lg">
                Watch Livestream
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section">
        <div className="u-container">
          <div className="home__intro">
            <p className="u-eyebrow">Fresh Arrivals</p>
            <h2>Featured Products</h2>
            <p className="home__intro-text">
              Hand-picked kits and collectibles from our latest inventory.
            </p>
          </div>

          {featured.length > 0 ? (
            <div className="home__product-grid">
              {featured.map((product) => (
                <article key={product.id} className="product-card">
                  <Link href={`/shop/${product.slug}`}>
                    <div className="product-card__media">
                      <Image
                        className="product-card__img"
                        src={product.images[0]?.src ?? "/images/placeholder.png"}
                        alt={product.images[0]?.alt ?? product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="product-card__body">
                      <h3 className="product-card__name">{product.name}</h3>
                      <p className="product-card__price">
                        {product.price != null
                          ? `$${product.price.toFixed(2)}`
                          : "View"}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="home__intro-text" style={{ textAlign: "center" }}>
              Product catalog will appear here once the scraper has run
              (<code>npm run scrape</code>) or the commerce API is connected.
            </p>
          )}

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
