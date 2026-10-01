import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

import { PRODUCT_STALE_TIME_MS } from "../constants";
import { getProducts } from "./getProducts";
import { productKeys } from "./productQueryKeys";
import type { CatalogFilters } from "../filters/catalogFilters";

export function infiniteProductsQueryOptions(filters: CatalogFilters) {
  return infiniteQueryOptions({
    queryKey: productKeys.infinite(filters),

    queryFn: ({ pageParam }) =>
      getProducts({
        page: pageParam,
        filters,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNextPage) {
        return undefined;
      }

      return lastPage.pagination.page + 1;
    },

    staleTime: PRODUCT_STALE_TIME_MS,
  });
}

export function useInfiniteProducts(filters: CatalogFilters) {
  return useInfiniteQuery(infiniteProductsQueryOptions(filters));
}
