import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./getProducts";
import { productKeys } from "./productQueryKeys";

export function useProducts() {
  return useQuery({
    queryKey: [productKeys],
    queryFn: getProducts,
  });
}
