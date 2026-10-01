import type { CatalogFilters } from "./filterLogic/catalogFilters";
import type { CatalogSort } from "./sortLogic/catalogSort";

export type CatalogQuery = {
  filters: CatalogFilters;
  sort: CatalogSort;
};
