import { useSearchParams } from "react-router";

import { CATALOG_SEARCH_PARAM, normalizeCatalogSearch } from "./catalogSearch";

export function useCatalogSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = normalizeCatalogSearch(searchParams.get(CATALOG_SEARCH_PARAM));

  function setSearch(nextSearch: string) {
    const nextParams = new URLSearchParams(searchParams);

    const normalizedSearch = normalizeCatalogSearch(nextSearch);

    if (normalizedSearch) {
      nextParams.set(CATALOG_SEARCH_PARAM, normalizedSearch);
    } else {
      nextParams.delete(CATALOG_SEARCH_PARAM);
    }

    // Search changes the result set, so return to the first page.
    nextParams.delete("page");

    setSearchParams(nextParams);
  }

  return {
    search,
    setSearch,
  };
}
