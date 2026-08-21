import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { asset } from "@/lib/asset";
import { getProducts, getProductBySlug } from "@/lib/store/api";

// Pre-render a static page for every product (required for output: export).
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const image = product.images[0];

  return (
    <section className="section">
      <div className="u-container product">
        <nav className="product__breadcrumb" aria-label="Breadcrumb">
          <Link href="/shop">Shop</Link>
          <span aria-hidden="true"> / </span>
          <span>{product.name}</span>
        </nav>

        <div className="product__layout">
          <div className="product__media">
            {image ? (
              <Image
                className="product__img"
                src={asset(image.src)}
                alt={image.alt ?? product.name}
                width={800}
                height={800}
                priority
              />
            ) : (
              <div className="product__img product__img--empty" aria-hidden="true" />
            )}
          </div>

          <div className="product__info">
            <h1 className="product__name">{product.name}</h1>
            {product.price != null && (
              <p className="product__price">${product.price.toFixed(2)}</p>
            )}
            <p className={`product__stock ${product.inStock ? "is-in" : "is-out"}`}>
              {product.inStock ? "In stock" : "Out of stock"}
            </p>

            {product.description && (
              <div className="product__description">
                <p>{product.description}</p>
              </div>
            )}

            <div className="product__actions">
              <button
                className="btn btn--accent btn--lg btn--block"
                disabled={!product.inStock}
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <p className="product__note">
                Checkout is enabled once the store’s commerce API is connected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
