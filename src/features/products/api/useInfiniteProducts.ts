import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

import { PRODUCT_STALE_TIME_MS } from "../constants";
import { getProducts } from "./getProducts";
import { productKeys } from "./productQueryKeys";

export function infiniteProductsQueryOptions(brands: string[] = []) {
  return infiniteQueryOptions({
    queryKey: productKeys.infinite(brands),

    queryFn: ({ pageParam }) =>
      getProducts({
        page: pageParam,
        brands,
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

export function useInfiniteProducts(brands: string[] = []) {
  return useInfiniteQuery(infiniteProductsQueryOptions(brands));
}
