import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { removeFacetParams } from "../facetLogic/catalogFacets";

import {
  normalizeFilterValues,
  normalizeSingleFilterValue,
  type CatalogFilters,
  type MultiCatalogFilterKey,
} from "./catalogFilters";

import { CATALOG_FILTER_PARAMS } from "../constants";

export function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Normalize URL state at the boundary so equivalent URLs
  // produce stable catalog state and cache keys.
  const filters: CatalogFilters = useMemo(
    () => ({
      brands: normalizeFilterValues(
        searchParams.getAll(CATALOG_FILTER_PARAMS.brands),
      ),

      pets: normalizeFilterValues(
        searchParams.getAll(CATALOG_FILTER_PARAMS.pets),
      ),

      category: normalizeSingleFilterValue(
        searchParams.get(CATALOG_FILTER_PARAMS.category),
      ),

      productTypes: normalizeFilterValues(
        searchParams.getAll(CATALOG_FILTER_PARAMS.productTypes),
      ),
    }),
    [searchParams],
  );

  function toggleMultiFilter(filter: MultiCatalogFilterKey, value: string) {
    const param = CATALOG_FILTER_PARAMS[filter];

    const nextParams = new URLSearchParams(searchParams);

    const currentValues = normalizeFilterValues(nextParams.getAll(param));

    const nextValues = currentValues.includes(value)
      ? currentValues.filter((currentValue) => currentValue !== value)
      : normalizeFilterValues([...currentValues, value]);

    nextParams.delete(param);

    // Facets depend on Category, so changing
    // Category invalidates all current facet state.
    removeFacetParams(nextParams);

    nextValues.forEach((nextValue) => {
      nextParams.append(param, nextValue);
    });

    nextParams.delete("page");

    setSearchParams(nextParams, {
      preventScrollReset: true,
    });
  }

  function setCategory(category: string | null) {
    const nextParams = new URLSearchParams(searchParams);

    const normalizedCategory = normalizeSingleFilterValue(category);

    nextParams.delete(CATALOG_FILTER_PARAMS.category);

    if (normalizedCategory) {
      nextParams.set(CATALOG_FILTER_PARAMS.category, normalizedCategory);
    }

    // Product Type depends on Category.
    // Changing the parent invalidates its child selections.
    nextParams.delete(CATALOG_FILTER_PARAMS.productTypes);

    // Later, category-dependent facet params will also
    // be cleared here through centralized facet logic.

    nextParams.delete("page");

    setSearchParams(nextParams);
  }

  return {
    filters,
    toggleMultiFilter,
    setCategory,
  };
}
