import styles from "./RatingStars.module.css";

type RatingStarsProps = {
  rating: number;
};

const STAR_COUNT = 5;

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2.6l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.16l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93L12 2.6z" />
    </svg>
  );
}

export function RatingStars({ rating }: RatingStarsProps) {
  const normalizedRating = Math.min(Math.max(rating, 0), STAR_COUNT);

  return (
    <div
      className={styles.stars}
      role="img"
      aria-label={`${normalizedRating.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: STAR_COUNT }, (_, index) => {
        const fillAmount = Math.min(Math.max(normalizedRating - index, 0), 1);

        return (
          <span key={index} className={styles.star}>
            <span className={styles.emptyStar}>
              <StarIcon />
            </span>

            <span
              className={styles.filledStar}
              style={{
                width: `${fillAmount * 100}%`,
              }}
            >
              <StarIcon />
            </span>
          </span>
        );
      })}
    </div>
  );
}
