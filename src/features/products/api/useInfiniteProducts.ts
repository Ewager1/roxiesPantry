import { useInfiniteQuery } from "@tanstack/react-query";

import { PRODUCT_STALE_TIME_MS } from "../constants";
import { getProducts } from "./getProducts";
import { productKeys } from "./productQueryKeys";


// Tanstack handles infinite page param internally, so we don't track it ourselves. 
export function useInfiniteProducts() {
  return useInfiniteQuery({
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
}
