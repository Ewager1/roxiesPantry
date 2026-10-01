import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { infiniteProductsQueryOptions } from "../features/products/api/useInfiniteProducts";
import { productQueryOptions } from "../features/products/api/useProducts";

import { CatalogSortSelect } from "../features/products/components/CatalogSortSelect";
import { InfiniteProductResults } from "../features/products/components/InfiniteProductResults";
import { PaginatedProductResults } from "../features/products/components/PaginatedProductResults";
import { ProductFilters } from "../features/products/components/filters/ProductFilters";

import { useCatalogQuery } from "../features/products/useCatalogQuery";

import styles from "./ProductsPage.module.css";

type ProductView = "pagination" | "infinite";

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryClient = useQueryClient();

  const query = useCatalogQuery();

  const view: ProductView =
    searchParams.get("view") === "infinite" ? "infinite" : "pagination";

  useEffect(() => {
    if (view === "pagination") {
      void queryClient
        .infiniteQuery(infiniteProductsQueryOptions(query))
        .catch((error) => {
          console.error("Infinite product cache warming failed:", error);
        });

      return;
    }

    void queryClient.query(productQueryOptions(1, query)).catch((error) => {
      console.error("Paginated product cache warming failed:", error);
    });
  }, [view, queryClient, query]);

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

        <p className={styles.subtitle}>Browse Roxie&apos;s Pantry</p>
      </header>

      <div className={styles.catalogLayout}>
        <ProductFilters />

        <section className={styles.results}>
          <div className={styles.resultsToolbar}>
            <div className={styles.viewToggle}>
              <button
                className={styles.viewToggleButton}
                disabled={view === "pagination"}
                onClick={() => changeView("pagination")}
              >
                Pages
              </button>

              <button
                className={styles.viewToggleButton}
                disabled={view === "infinite"}
                onClick={() => changeView("infinite")}
              >
                Infinite Scroll
              </button>
            </div>

            <CatalogSortSelect />
          </div>

          {view === "infinite" ? (
            <InfiniteProductResults />
          ) : (
            <PaginatedProductResults />
          )}
        </section>
      </div>
    </main>
  );
}
