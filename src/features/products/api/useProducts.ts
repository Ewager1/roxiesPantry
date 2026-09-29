import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./getProducts";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}
