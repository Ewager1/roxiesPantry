import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getProducts } from "./getProducts";
import { productKeys } from "./productQueryKeys";
import { PRODUCT_STALE_TIME_MS } from "../constants";

export function useProducts(page: number) {
  return useQuery({
    queryKey: productKeys.list(page),

    queryFn: () => getProducts(page),
    placeholderData: keepPreviousData,
    staleTime: PRODUCT_STALE_TIME_MS,
  });
}
