import { useMemo } from "react";

import type { CatalogQuery } from "./catalogQuery";
import { useCatalogFilters } from "./filterLogic/useCatalogFilters";
import { useCatalogPriceRange } from "./priceLogic/useCatalogPriceRange";
import { useCatalogSearch } from "./searchLogic/useCatalogSearch";
import { useCatalogSort } from "./sortLogic/useCatalogSort";
import { useCatalogFacets } from "./facetLogic/useCatalogFacets";

export function useCatalogQuery(): CatalogQuery {
  const { filters } = useCatalogFilters();
  const { sort } = useCatalogSort();
  const { search } = useCatalogSearch();
  const { priceRange } = useCatalogPriceRange();
  const { facets } = useCatalogFacets();

  return useMemo(
    () => ({
      filters,
      facets,
      sort,
      search,
      priceRange,
    }),
    [filters, facets, sort, search, priceRange],
  );
}
