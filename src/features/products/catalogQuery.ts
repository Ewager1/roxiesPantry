import type { CatalogFilters } from "./filterLogic/catalogFilters";
import type { CatalogFacetSelections } from "./facetLogic/catalogFacets";
import type { CatalogPriceRange } from "./priceLogic/catalogPriceRange";
import type { CatalogSort } from "./sortLogic/catalogSort";

export type CatalogQuery = {
  filters: CatalogFilters;
  facets: CatalogFacetSelections;
  sort: CatalogSort;
  search: string;
  priceRange: CatalogPriceRange;
};
