import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  parseProductQuery,
  type ProductCacheEntry,
} from "./productCacheEntries";

export function useProductCacheEntries(): ProductCacheEntry[] {
  const queryClient = useQueryClient();

  const readEntries = useCallback((): ProductCacheEntry[] => {
    return queryClient
      .getQueryCache()
      .findAll({
        queryKey: ["products"],
      })
      .map((query) => parseProductQuery(query.queryKey, query.state.data))
      .filter((entry): entry is ProductCacheEntry => entry !== null);
  }, [queryClient]);

  const [entries, setEntries] = useState<ProductCacheEntry[]>(() =>
    readEntries(),
  );

  useEffect(() => {
    const queryCache = queryClient.getQueryCache();

    let isActive = true;
    let updateScheduled = false;

    function scheduleUpdate() {
      // QueryCache notifications can happen while another
      // component is rendering. Defer the React state update
      // until the current render has completed.
      if (updateScheduled) {
        return;
      }

      updateScheduled = true;

      queueMicrotask(() => {
        updateScheduled = false;

        if (!isActive) {
          return;
        }

        setEntries(readEntries());
      });
    }

    const unsubscribe = queryCache.subscribe((event) => {
      // The inspector only represents product-result
      // queries. Ignore catalog metadata and other caches.
      if (event.query.queryKey[0] !== "products") {
        return;
      }

      scheduleUpdate();
    });

    scheduleUpdate();

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [queryClient, readEntries]);

  return entries;
}
