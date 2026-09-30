import { useEffect, useRef } from "react";

import { useInfiniteProducts } from "../api/useInfiniteProducts";

import { ProductGrid } from "./ProductGrid";

import { INFINITE_SCROLL_ROOT_MARGIN } from "../constants";

export function InfiniteProductResults() {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts();

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
        // Begin loading shortly before the user reaches the end.
        rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
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
    return <p>Error: {error.message}</p>;
  }

  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <>
      <ProductGrid products={products} />

      <div ref={loadMoreRef} style={{ height: "1px" }} aria-hidden="true" />

      {isFetchingNextPage && <p>Loading more products...</p>}

      {!hasNextPage && <p>You've reached the end.</p>}
    </>
  );
}
