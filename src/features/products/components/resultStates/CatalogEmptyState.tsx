import { useActiveCatalogFilters } from "../../filterLogic/useActivityCatalogFilters";

import styles from "./CatalogEmptyState.module.css";

export function CatalogEmptyState() {
  const { activeFilters, clearAllFilters } = useActiveCatalogFilters();

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className={styles.emptyState}>
      <h2 className={styles.title}>No products found</h2>

      <p className={styles.message}>
        {hasActiveFilters
          ? "No products match your current filters. Try removing one or more filters."
          : "No products match your current search. Try a different search."}
      </p>

      {hasActiveFilters && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={clearAllFilters}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
