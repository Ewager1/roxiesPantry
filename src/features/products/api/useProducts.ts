import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getProducts } from "./getProducts";
import { productKeys } from "./productQueryKeys";

export function useProducts(page: number) {
  return useQuery({
    queryKey: productKeys.list(page),

    queryFn: () => getProducts(page),
    placeholderData: keepPreviousData,
  });
}
