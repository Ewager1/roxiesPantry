import { queryOptions, useQuery } from "@tanstack/react-query";

import { CATALOG_FILTER_OPTIONS_STALE_TIME_MS } from "../constants";
import { getCatalogFilterContext } from "./getCatalogFilterContext";

function getCategoryFromQueryKey(queryKey: readonly unknown[]): string | null {
  const context = queryKey[2];

  if (
    typeof context !== "object" ||
    context === null ||
    !("category" in context)
  ) {
    return null;
  }

  return typeof context.category === "string" ? context.category : null;
}

export function catalogFilterContextQueryOptions(
  category: string,
  productTypes: string[],
) {
  return queryOptions({
    queryKey: [
      "catalog",
      "filter-context",
      {
        category,
        productTypes,
      },
    ],

    queryFn: () => getCatalogFilterContext(category, productTypes),

    staleTime: CATALOG_FILTER_OPTIONS_STALE_TIME_MS,

    // Preserve the previous context when Product Type
    // changes within the same Category, but never carry
    // one Category's facets into another Category.
    placeholderData: (previousData, previousQuery) => {
      const previousCategory = previousQuery
        ? getCategoryFromQueryKey(previousQuery.queryKey)
        : null;

      return previousCategory === category ? previousData : undefined;
    },
  });
}

export function useCatalogFilterContext(
  category: string | null,
  productTypes: string[],
) {
  return useQuery({
    ...catalogFilterContextQueryOptions(category ?? "", productTypes),

    enabled: category !== null,
  });
}
