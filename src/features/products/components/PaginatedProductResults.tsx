import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { getProducts } from "../api/getProducts";
import { productKeys } from "../api/productQueryKeys";
import { useProducts } from "../api/useProducts";
import { PRODUCT_STALE_TIME_MS } from "../constants";

import { ProductGrid } from "./ProductGrid";
import { ProductPagination } from "./ProductPagination";

export function PaginatedProductResults() {
  const [searchParams] = useSearchParams();

  // deduping and sorting to give same filter state to cache.
  const brands = searchParams
    .getAll("brand")
    .filter((brand, index, allBrands) => allBrands.indexOf(brand) === index)
    .sort();

  const queryClient = useQueryClient();

  const pageParam = Number(searchParams.get("page"));

  // Guard against invalid page values manually entered into the URL.
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const { data, isPending, isError, error } = useProducts(page, brands);

  const products = data?.items ?? [];

  const pagination = data?.pagination;

  // Return the user to the top when navigating between result pages.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  // Warm the cache with the next page when one is available.
  useEffect(() => {
    if (!pagination?.hasNextPage) {
      return;
    }

    const nextPage = pagination.page + 1;

    void queryClient
      .query({
        queryKey: productKeys.list(nextPage, brands),

        queryFn: () =>
          getProducts({
            page: nextPage,
            brands,
          }),

        staleTime: PRODUCT_STALE_TIME_MS,
      })
      .catch((error) => {
        console.error("Product prefetch failed:", error);
      });
  }, [pagination?.page, pagination?.hasNextPage, queryClient, brands]);

  if (isPending) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <>
      <ProductGrid products={products} />

      {pagination && <ProductPagination pagination={pagination} />}
    </>
  );
}
