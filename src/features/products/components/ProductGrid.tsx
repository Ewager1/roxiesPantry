import type { Product } from "../types";
import { ProductCard } from "./ProductCard";
import styles from "./ProductGrid.module.css";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className={styles.grid} aria-label="Products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
