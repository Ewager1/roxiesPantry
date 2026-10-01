import { useMemo } from "react";

import type { CatalogQuery } from "./catalogQuery";
import { useCatalogFilters } from "./filterLogic/useCatalogFilters";
import { useCatalogSort } from "./sortLogic/useCatalogSort";

export function useCatalogQuery(): CatalogQuery {
  const { filters } = useCatalogFilters();
  const { sort } = useCatalogSort();

  return useMemo(
    () => ({
      filters,
      sort,
    }),
    [filters, sort],
  );
}
