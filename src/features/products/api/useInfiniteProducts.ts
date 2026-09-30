import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

import { PRODUCT_STALE_TIME_MS } from "../constants";
import { getProducts } from "./getProducts";
import { productKeys } from "./productQueryKeys";

export const infiniteProductsQueryOptions = infiniteQueryOptions({
  queryKey: productKeys.infinite(),

  queryFn: ({ pageParam }) => getProducts(pageParam),

  initialPageParam: 1,

  getNextPageParam: (lastPage) => {
    if (!lastPage.pagination.hasNextPage) {
      return undefined;
    }

    return lastPage.pagination.page + 1;
  },

  staleTime: PRODUCT_STALE_TIME_MS,
});

export function useInfiniteProducts() {
  return useInfiniteQuery(infiniteProductsQueryOptions);
}
