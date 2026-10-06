import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { productQueryOptions, useProducts } from "../api/useProducts";

import { useCatalogQuery } from "../useCatalogQuery";

import { CatalogStatusBar } from "./CatalogStatusBar";
import { ProductGrid } from "./ProductGrid";
import { ProductPagination } from "./ProductPagination";
import { CatalogEmptyState } from "./resultStates/CatalogEmptyState";

export function PaginatedProductResults() {
  const [searchParams] = useSearchParams();

  const queryClient = useQueryClient();

  const pageParam = Number(searchParams.get("page"));

  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const query = useCatalogQuery();

  const { data, isFetching } = useProducts(page, query);

  const products = data.items;
  const pagination = data.pagination;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  useEffect(() => {
    if (!pagination.hasNextPage) {
      return;
    }

    const nextPage = pagination.page + 1;

    void queryClient
      .query(productQueryOptions(nextPage, query))
      .catch((error) => {
        console.error("Product prefetch failed:", error);
      });
  }, [pagination.page, pagination.hasNextPage, queryClient, query]);

  return (
    <>
      <CatalogStatusBar
        totalItems={pagination.totalItems}
        isUpdating={isFetching}
      />

      {products.length === 0 ? (
        <CatalogEmptyState />
      ) : (
        <>
          <ProductGrid products={products} />

          <ProductPagination pagination={pagination} />
        </>
      )}
    </>
  );
}
