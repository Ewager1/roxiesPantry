// external
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

//internal data
import { getProducts } from "../features/products/api/getProducts";
import { productKeys } from "../features/products/api/productQueryKeys";
import { useProducts } from "../features/products/api/useProducts";
import { PRODUCT_STALE_TIME_MS } from "../features/products/constants";

// internal components
import { ProductGrid } from "../features/products/components/ProductGrid";
import { ProductPagination } from "../features/products/components/ProductPagination";

// styles
import styles from "./ProductsPage.module.css";

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page"));

  const queryClient = useQueryClient();

  // validating number in case user manually enters incorrect info into URL
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const { data, isPending, isError, error } = useProducts(page);

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
      .query({
        queryKey: productKeys.list(nextPage),
        queryFn: () => getProducts(nextPage),
        staleTime: PRODUCT_STALE_TIME_MS,
      })
      .catch((error) => {
        console.error("Product Prefetch failed", error);
      });
  }, [pagination?.page, pagination?.hasNextPage, queryClient]);

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
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.subtitle}>Browse Roxie’s Pantry</p>
      </header>

      <ProductGrid products={products} />

      {pagination && <ProductPagination pagination={pagination} />}
    </main>
  );
}
