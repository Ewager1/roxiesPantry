import { useDelayedBoolean } from "../../../hooks/useDelayedBoolean";
import { useActiveCatalogFilters } from "../filterLogic/useActivityCatalogFilters";

import styles from "./CatalogStatusBar.module.css";

type CatalogStatusBarProps = {
  totalItems: number | null;
  isPending?: boolean;
  isUpdating?: boolean;
};

export function CatalogStatusBar({
  totalItems,
  isPending = false,
  isUpdating = false,
}: CatalogStatusBarProps) {
  const { activeFilters, clearAllFilters } = useActiveCatalogFilters();

  const showPending = useDelayedBoolean(isPending, 200);
  const showUpdating = useDelayedBoolean(isUpdating, 200);

  const hasFilters = activeFilters.length > 0;

  const productLabel = totalItems === 1 ? "product" : "products";

  return (
    <div className={styles.statusBar} aria-live="polite">
      <div className={styles.resultCount}>
        {totalItems === null
          ? "Products"
          : `${totalItems.toLocaleString()} ${productLabel}`}
      </div>

      <div className={styles.statusContent}>
        {isPending ? (
          showPending ? (
            <span className={styles.fetchStatus}>Loading products...</span>
          ) : null
        ) : showUpdating ? (
          <span className={styles.fetchStatus}>Updating results...</span>
        ) : hasFilters ? (
          <div className={styles.chipScroller}>
            {activeFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={styles.chip}
                onClick={filter.remove}
                aria-label={`Remove ${filter.label} filter`}
              >
                <span>{filter.label}</span>

                <span className={styles.chipRemove} aria-hidden="true">
                  ×
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {!isPending && !showUpdating && hasFilters && (
        <button
          type="button"
          className={styles.clearAll}
          onClick={clearAllFilters}
        >
          Clear all
        </button>
      )}
    </div>
  );
}
