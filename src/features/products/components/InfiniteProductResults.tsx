import { useEffect, useRef } from "react";

import { useInfiniteProducts } from "../api/useInfiniteProducts";
import { useCatalogQuery } from "../useCatalogQuery";

import { CatalogStatusBar } from "./CatalogStatusBar";
import { ProductGrid } from "./ProductGrid";
import { CatalogEmptyState } from "./resultStates/CatalogEmptyState";
import { ReturnToTopButton } from "./ReturnToTopButton";

import styles from "./InifiniteProductResults.module.css";

export function InfiniteProductResults() {
  const query = useCatalogQuery();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteProducts(query);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const products = data.pages.flatMap((page) => page.items);

  const totalItems = data.pages[0]?.pagination.totalItems ?? 0;

  useEffect(() => {
    const sentinel = loadMoreRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      {
        rootMargin: "300px 0px",
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <CatalogStatusBar
        totalItems={totalItems}
        isUpdating={isFetching && !isFetchingNextPage}
      />

      {products.length === 0 ? (
        <CatalogEmptyState />
      ) : (
        <>
          <ProductGrid products={products} />

          <div ref={loadMoreRef} style={{ height: "1px" }} aria-hidden="true" />

          {isFetchingNextPage && (
            <p className={styles.loadMoreStatus} aria-live="polite">
              Loading more products...
            </p>
          )}
        </>
      )}
      <ReturnToTopButton />
    </>
  );
}
