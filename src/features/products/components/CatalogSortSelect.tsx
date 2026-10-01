import {
  CATALOG_SORT_OPTIONS,
  type CatalogSort,
} from "../sortLogic/catalogSort";
import { useCatalogSort } from "../sortLogic/useCatalogSort";

import styles from "./CatalogSortSelect.module.css";

const SORT_LABELS: Record<CatalogSort, string> = {
  "name-ascending": "Name: A to Z",
  "price-low-to-high": "Price: Low to High",
  "price-high-to-low": "Price: High to Low",
  rating: "Customer Rating",
};

export function CatalogSortSelect() {
  const { sort, setSort } = useCatalogSort();

  return (
    <label className={styles.control}>
      <span className={styles.label}>Sort by</span>

      <select
        className={styles.select}
        value={sort}
        onChange={(event) => setSort(event.target.value as CatalogSort)}
      >
        {Object.values(CATALOG_SORT_OPTIONS).map((option) => (
          <option key={option} value={option}>
            {SORT_LABELS[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
