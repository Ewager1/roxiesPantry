import { useSearchParams } from "react-router";

import {
  CATALOG_SORT_OPTIONS,
  DEFAULT_CATALOG_SORT,
  type CatalogSort,
} from "./catalogSort";

const VALID_SORTS = new Set<CatalogSort>(
  Object.values(CATALOG_SORT_OPTIONS),
);

export function useCatalogSort() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const sortParam = searchParams.get("sort");

  const sort: CatalogSort =
    sortParam &&
    VALID_SORTS.has(sortParam as CatalogSort)
      ? (sortParam as CatalogSort)
      : DEFAULT_CATALOG_SORT;

  function setSort(nextSort: CatalogSort) {
    const nextParams =
      new URLSearchParams(searchParams);

    if (nextSort === DEFAULT_CATALOG_SORT) {
      nextParams.delete("sort");
    } else {
      nextParams.set("sort", nextSort);
    }

    // reset pagination on sort change
    nextParams.delete("page");

    setSearchParams(nextParams);
  }

  return {
    sort,
    setSort,
  };
}
