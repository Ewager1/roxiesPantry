import type { Product } from "../types";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <img className={styles.image} src={product.imageUrl} alt={product.name} />

      <div className={styles.metadata}>
        <p className={styles.brand}>{product.brand.name}</p>

        <p className={styles.pet}>{product.pet.name}</p>
      </div>

      <h2 className={styles.name}>{product.name}</h2>

      <p className={styles.rating}>
        {product.rating ?? "No rating"} ({product.reviewCount})
      </p>

      <p className={styles.price}>${product.price}</p>
    </article>
  );
}
