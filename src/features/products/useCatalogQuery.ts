import { useMemo } from "react";

import type { CatalogQuery } from "./catalogQuery";
import { useCatalogFilters } from "./filterLogic/useCatalogFilters";
import { useCatalogSearch } from "./searchLogic/useCatalogSearch";
import { useCatalogSort } from "./sortLogic/useCatalogSort";

export function useCatalogQuery(): CatalogQuery {
  const { filters } = useCatalogFilters();
  const { sort } = useCatalogSort();
  const { search } = useCatalogSearch();

  return useMemo(
    () => ({
      filters,
      sort,
      search,
    }),
    [filters, sort, search],
  );
}
