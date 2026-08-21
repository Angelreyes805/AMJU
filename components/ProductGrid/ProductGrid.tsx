import ProductCard from "@/components/ProductCard/ProductCard";
import type { Product } from "@/lib/store/types";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
