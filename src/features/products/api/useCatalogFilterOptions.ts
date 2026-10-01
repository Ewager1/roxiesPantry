import { queryOptions, useQuery } from "@tanstack/react-query";

import { CATALOG_FILTER_OPTIONS_STALE_TIME_MS } from "../constants";

import { getCatalogFilterOptions } from "./getCatalogFilterOptions";

export const catalogFilterOptionsQueryOptions = queryOptions({
  queryKey: ["catalog", "filter-options"],

  queryFn: getCatalogFilterOptions,

  staleTime: CATALOG_FILTER_OPTIONS_STALE_TIME_MS,
});

export function useCatalogFilterOptions() {
  return useQuery(catalogFilterOptionsQueryOptions);
}
