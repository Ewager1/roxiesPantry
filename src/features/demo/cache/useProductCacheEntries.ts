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

    function updateEntries() {
      setEntries(readEntries());
    }

    const unsubscribe = queryCache.subscribe(updateEntries);

    updateEntries();

    return unsubscribe;
  }, [queryClient, readEntries]);

  return entries;
}
