import styles from "./CatalogErrorState.module.css";

type CatalogErrorStateProps = {
  onRetry: () => void;
};

export function CatalogErrorState({ onRetry }: CatalogErrorStateProps) {
  return (
    <div className={styles.errorState} role="alert">
      <h2 className={styles.title}>Something went wrong</h2>

      <p className={styles.message}>
        We couldn&apos;t load the products. Please try again.
      </p>

      <button type="button" className={styles.retryButton} onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
