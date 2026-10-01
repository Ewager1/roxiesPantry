import { useMemo } from "react";
import { useSearchParams } from "react-router";

import {
  normalizeFilterValues,
  type CatalogFilterKey,
  type CatalogFilters,
} from "./catalogFilters";
import { CATALOG_FILTER_PARAMS } from "../constants";

export function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Memoize normalized filters so unchanged URL state
  // keeps a stable object reference.
  const filters: CatalogFilters = useMemo(
    () => ({
      brands: normalizeFilterValues(
        searchParams.getAll(CATALOG_FILTER_PARAMS.brands),
      ),

      pets: normalizeFilterValues(
        searchParams.getAll(CATALOG_FILTER_PARAMS.pets),
      ),

      categories: normalizeFilterValues(
        searchParams.getAll(CATALOG_FILTER_PARAMS.categories),
      ),

      productTypes: normalizeFilterValues(
        searchParams.getAll(CATALOG_FILTER_PARAMS.productTypes),
      ),
    }),
    [searchParams],
  );

  function toggleFilter(filter: CatalogFilterKey, value: string) {
    const param = CATALOG_FILTER_PARAMS[filter];

    const nextParams = new URLSearchParams(searchParams);

    const currentValues = normalizeFilterValues(nextParams.getAll(param));

    const nextValues = currentValues.includes(value)
      ? currentValues.filter((currentValue) => currentValue !== value)
      : normalizeFilterValues([...currentValues, value]);

    nextParams.delete(param);

    nextValues.forEach((nextValue) => {
      nextParams.append(param, nextValue);
    });

    // A changed filter may make the current page invalid.
    nextParams.delete("page");

    setSearchParams(nextParams);
  }

  return {
    filters,
    toggleFilter,
  };
}
