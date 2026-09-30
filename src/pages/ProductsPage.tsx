import { useProducts } from "../features/products/api/useProducts";
import { ProductGrid } from "../features/products/components/ProductGrid";
import { ProductPagination } from "../features/products/components/ProductPagination";

import { useEffect } from "react";

import { useSearchParams } from "react-router";
import styles from "./ProductsPage.module.css";

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page"));

  // validating number in case user manually enters incorrect info into URL
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const { data, isPending, isError, error } = useProducts(page);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const products = data?.items ?? [];
  const pagination = data?.pagination;

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
