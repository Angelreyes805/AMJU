import Link from "next/link";
import Image from "next/image";
import { asset } from "@/lib/asset";
import type { Product } from "@/lib/store/types";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const href = `/shop/${product.slug}`;

  return (
    <article className="product-card">
      <Link href={href} className="product-card__media">
        {image ? (
          <Image
            className="product-card__img"
            src={asset(image.src)}
            alt={image.alt ?? product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className="product-card__placeholder" aria-hidden="true" />
        )}
        {!product.inStock && (
          <span className="product-card__badge">Out of Stock</span>
        )}
      </Link>
      <div className="product-card__body">
        <Link href={href}>
          <h3 className="product-card__name">{product.name}</h3>
        </Link>
        {product.price != null && (
          <p className="product-card__price">${product.price.toFixed(2)}</p>
        )}
        <button
          className="btn btn--primary btn--sm btn--block"
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}
