import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { PRODUCT_STALE_TIME_MS } from "../constants";
import type { CatalogQuery } from "../catalogQuery";

import { getProducts } from "./getProducts";
import { productKeys } from "./productQueryKeys";

export function productQueryOptions(page: number, query: CatalogQuery) {
  return queryOptions({
    queryKey: productKeys.list(page, query),

    queryFn: () =>
      getProducts({
        page,
        query,
      }),

    staleTime: PRODUCT_STALE_TIME_MS,
  });
}

export function useProducts(page: number, query: CatalogQuery) {
  return useSuspenseQuery(productQueryOptions(page, query));
}
