import { useSearchParams } from "react-router";

import { InfiniteProductResults } from "../features/products/components/InfiniteProductResults";
import { PaginatedProductResults } from "../features/products/components/PaginatedProductResults";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { productQueryOptions } from "../features/products/api/useProducts";
import { infiniteProductsQueryOptions } from "../features/products/api/useInfiniteProducts";

import styles from "./ProductsPage.module.css";
import { useCatalogFilters } from "../features/products/filters/useCatalogFilters";

type ProductView = "pagination" | "infinite";

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryClient = useQueryClient();

  const view: ProductView =
    searchParams.get("view") === "infinite" ? "infinite" : "pagination";

  const { filters } = useCatalogFilters();

  useEffect(() => {
    if (view === "pagination") {
      void queryClient
        .infiniteQuery(infiniteProductsQueryOptions(filters))
        .catch((error) => {
          console.error("Infinite product cache warming failed:", error);
        });

      return;
    }

    void queryClient.query(productQueryOptions(1, filters)).catch((error) => {
      console.error("Paginated product cache warming failed:", error);
    });
  }, [view, queryClient, filters]);

  function changeView(nextView: ProductView) {
    const nextParams = new URLSearchParams(searchParams);

    // Pagination is the default view, so it does not need a URL parameter.
    if (nextView === "pagination") {
      nextParams.delete("view");
    } else {
      nextParams.set("view", "infinite");
    }

    // Page numbers do not carry meaning between result modes.
    nextParams.delete("page");

    setSearchParams(nextParams);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Products</h1>

        <p className={styles.subtitle}>Browse Roxie’s Pantry</p>
      </header>

      <div className={styles.viewToggle}>
        <button
          className={styles.viewToggleButton}
          type="button"
          disabled={view === "pagination"}
          onClick={() => changeView("pagination")}
        >
          Pages
        </button>

        <button
          className={styles.viewToggleButton}
          type="button"
          disabled={view === "infinite"}
          onClick={() => changeView("infinite")}
        >
          Infinite Scroll
        </button>
      </div>

      {view === "infinite" ? (
        <InfiniteProductResults />
      ) : (
        <PaginatedProductResults />
      )}
    </main>
  );
}
