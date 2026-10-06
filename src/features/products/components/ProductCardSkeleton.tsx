import styles from "./ProductCardSkeleton.module.css";

export function ProductCardSkeleton() {
  return (
    <article className={styles.card} aria-hidden="true">
      <div className={`${styles.image} ${styles.pulse}`} />

      <div className={styles.metadata}>
        <div className={`${styles.shortLine} ${styles.pulse}`} />
        <div className={`${styles.shortLine} ${styles.pulse}`} />
      </div>

      <div className={`${styles.titleLine} ${styles.pulse}`} />
      <div className={`${styles.titleLineShort} ${styles.pulse}`} />

      <div className={`${styles.ratingLine} ${styles.pulse}`} />

      <div className={`${styles.priceLine} ${styles.pulse}`} />
    </article>
  );
}
