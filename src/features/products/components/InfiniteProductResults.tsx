import { useInfiniteProducts } from "../api/useInfiniteProducts";
import { ProductGrid } from "./ProductGrid";
import { useEffect, useRef } from "react";

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

  // products is expected to be a single array
  const products = data?.pages.flatMap((page) => page.items) ?? [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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
        // Start loading before the user reaches the exact bottom.
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
    return <p>Error: {error.message}</p>;
  }

  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <>
      <ProductGrid products={products} />

      <div ref={loadMoreRef} />

      {isFetchingNextPage && <p>Loading more products...</p>}

      {!hasNextPage && <p>You've reached the end.</p>}
    </>
  );
}
