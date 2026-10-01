import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { productQueryOptions, useProducts } from "../api/useProducts";

import { ProductGrid } from "./ProductGrid";
import { ProductPagination } from "./ProductPagination";

import { useCatalogFilters } from "../filters/useCatalogFilters";

export function PaginatedProductResults() {
  const [searchParams] = useSearchParams();

  const queryClient = useQueryClient();

  const pageParam = Number(searchParams.get("page"));

  // Guard against invalid page values manually entered into the URL.
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const { filters } = useCatalogFilters();

  const { data, isPending, isError, error } = useProducts(page, filters);

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
      .query(productQueryOptions(nextPage, filters))
      .catch((error) => {
        console.error("Product prefetch failed:", error);
      });
  }, [pagination?.page, pagination?.hasNextPage, queryClient, filters]);

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
