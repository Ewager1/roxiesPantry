import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import { useInfiniteProducts } from "../api/useInfiniteProducts";

import { ProductGrid } from "./ProductGrid";

export function InfiniteProductResults() {
  const [searchParams] = useSearchParams();

  const brands = [...new Set(searchParams.getAll("brand"))].sort();

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts(brands);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const products = data?.pages.flatMap((page) => page.items) ?? [];

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

  if (isPending) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return (
      <p>
        Failed to load products:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <>
      <ProductGrid products={products} />

      <div ref={loadMoreRef} style={{ height: "1px" }} aria-hidden="true" />

      {isFetchingNextPage && <p>Loading more products...</p>}

      {!hasNextPage && <p>You’ve reached the end.</p>}
    </>
  );
}
