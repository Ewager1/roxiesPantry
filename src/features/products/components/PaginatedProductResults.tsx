import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { productQueryOptions, useProducts } from "../api/useProducts";

import { useCatalogQuery } from "../useCatalogQuery";

import { CatalogStatusBar } from "./CatalogStatusBar";
import { ProductGrid } from "./ProductGrid";
import { ProductPagination } from "./ProductPagination";

export function PaginatedProductResults() {
  const [searchParams] = useSearchParams();

  const queryClient = useQueryClient();

  const pageParam = Number(searchParams.get("page"));

  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const query = useCatalogQuery();

  const { data, isPending, isError, error, isFetching } = useProducts(
    page,
    query,
  );

  const products = data?.items ?? [];

  const pagination = data?.pagination;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  useEffect(() => {
    if (!pagination?.hasNextPage) {
      return;
    }

    const nextPage = pagination.page + 1;

    void queryClient
      .query(productQueryOptions(nextPage, query))
      .catch((error) => {
        console.error("Product prefetch failed:", error);
      });
  }, [pagination?.page, pagination?.hasNextPage, queryClient, query]);

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  if (isPending) {
    return <CatalogStatusBar totalItems={null} isPending />;
  }

  return (
    <>
      <CatalogStatusBar
        totalItems={pagination?.totalItems ?? 0}
        isUpdating={isFetching}
      />

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <ProductGrid products={products} />

          {pagination && <ProductPagination pagination={pagination} />}
        </>
      )}
    </>
  );
}
