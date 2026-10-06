import type { Product } from "../types";
import { formatCurrency } from "../../../utils/formatCurrency";

import { RatingStars } from "./RatingStars";

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

      {product.rating !== null ? (
        <div className={styles.rating}>
          <RatingStars rating={product.rating} />

          <span className={styles.ratingValue}>
            {product.rating.toFixed(1)}
          </span>

          <span className={styles.reviewCount}>
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>
      ) : (
        <p className={styles.noRating}>No reviews yet</p>
      )}

      <p className={styles.price}>{formatCurrency(product.price)}</p>
    </article>
  );
}
