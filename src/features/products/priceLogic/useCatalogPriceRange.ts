import { useMemo } from "react";
import { useSearchParams } from "react-router";

import {
  normalizeCatalogPriceRange,
  type CatalogPriceRange,
} from "./catalogPriceRange";

const MIN_PRICE_PARAM = "minPrice";
const MAX_PRICE_PARAM = "maxPrice";

export function useCatalogPriceRange() {
  const [searchParams, setSearchParams] = useSearchParams();

  const minPriceParam = searchParams.get(MIN_PRICE_PARAM);

  const maxPriceParam = searchParams.get(MAX_PRICE_PARAM);

  // Keep the normalized range stable when unrelated URL state changes.
  const priceRange = useMemo(
    () => normalizeCatalogPriceRange(minPriceParam, maxPriceParam),
    [minPriceParam, maxPriceParam],
  );

  function setPriceRange(nextRange: CatalogPriceRange) {
    const nextParams = new URLSearchParams(searchParams);

    // Normalize before writing so the URL stays canonical.
    const normalizedRange = normalizeCatalogPriceRange(
      nextRange.min === null ? null : String(nextRange.min),
      nextRange.max === null ? null : String(nextRange.max),
    );

    if (normalizedRange.min === null) {
      nextParams.delete(MIN_PRICE_PARAM);
    } else {
      nextParams.set(MIN_PRICE_PARAM, String(normalizedRange.min));
    }

    if (normalizedRange.max === null) {
      nextParams.delete(MAX_PRICE_PARAM);
    } else {
      nextParams.set(MAX_PRICE_PARAM, String(normalizedRange.max));
    }

    // Price changes the result set, so return to the first page.
    nextParams.delete("page");

    setSearchParams(nextParams);
  }

  return {
    priceRange,
    setPriceRange,
  };
}
