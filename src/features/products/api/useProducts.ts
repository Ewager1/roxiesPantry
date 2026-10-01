import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import { PRODUCT_STALE_TIME_MS } from "../constants";
import { getProducts } from "./getProducts";
import { productKeys } from "./productQueryKeys";

import type { CatalogFilters } from "../filters/catalogFilters";

export function productQueryOptions(page: number, filters: CatalogFilters) {
  return queryOptions({
    queryKey: productKeys.list(page, filters),
    queryFn: () =>
      getProducts({
        page,
        filters,
      }),
    placeholderData: keepPreviousData,
    staleTime: PRODUCT_STALE_TIME_MS,
  });
}

export function useProducts(page: number, filters: CatalogFilters) {
  return useQuery(productQueryOptions(page, filters));
}
