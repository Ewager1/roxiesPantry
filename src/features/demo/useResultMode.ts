import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { infiniteProductsQueryOptions } from "../products/api/useInfiniteProducts";
import { productQueryOptions } from "../products/api/useProducts";
import type { CatalogQuery } from "../products/catalogQuery";

export type ResultMode = "pagination" | "infinite";

export function useResultMode(query: CatalogQuery) {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryClient = useQueryClient();

  const view: ResultMode =
    searchParams.get("view") === "infinite" ? "infinite" : "pagination";

  // Warm the alternate result-mode cache so switching views
  // can reuse data instead of starting with a cold request.
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

  function changeView(nextView: ResultMode) {
    const nextParams = new URLSearchParams(searchParams);

    // Pagination is the default result mode,
    // so it does not need a URL parameter.
    if (nextView === "pagination") {
      nextParams.delete("view");
    } else {
      nextParams.set("view", "infinite");
    }

    // Page numbers do not carry meaning between result modes.
    nextParams.delete("page");

    setSearchParams(nextParams);
  }

  return {
    view,
    changeView,
  };
}
