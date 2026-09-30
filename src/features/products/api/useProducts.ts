import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import { PRODUCT_STALE_TIME_MS } from "../constants";
import { getProducts } from "./getProducts";
import { productKeys } from "./productQueryKeys";

export function productQueryOptions(page: number, brands: string[] = []) {
  return queryOptions({
    queryKey: productKeys.list(page, brands),
    queryFn: () =>
      getProducts({
        page,
        brands,
      }),
    placeholderData: keepPreviousData,
    staleTime: PRODUCT_STALE_TIME_MS,
  });
}

export function useProducts(page: number, brands: string[] = []) {
  return useQuery(productQueryOptions(page, brands));
}
