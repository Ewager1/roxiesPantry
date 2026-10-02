import {
  infiniteQueryOptions,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";

import { PRODUCT_STALE_TIME_MS } from "../constants";
import type { CatalogQuery } from "../catalogQuery";

import { getProducts } from "./getProducts";
import { productKeys } from "./productQueryKeys";

export function infiniteProductsQueryOptions(query: CatalogQuery) {
  return infiniteQueryOptions({
    queryKey: productKeys.infinite(query),

    queryFn: ({ pageParam }) =>
      getProducts({
        page: pageParam,
        query,
      }),
    placeholderData: keepPreviousData,
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

export function useInfiniteProducts(query: CatalogQuery) {
  return useInfiniteQuery(infiniteProductsQueryOptions(query));
}
