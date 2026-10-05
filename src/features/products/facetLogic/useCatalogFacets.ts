import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

import {
  getFacetSlugFromParam,
  normalizeFacetSelections,
  pruneFacetSelections as getPrunedFacetSelections,
  writeFacetSelections,
  type AvailableFacet,
  type CatalogFacetSelections,
} from "./catalogFacets";

export function useCatalogFacets() {
  const [searchParams, setSearchParams] = useSearchParams();

  const facets: CatalogFacetSelections = useMemo(() => {
    const rawSelections: CatalogFacetSelections = {};

    searchParams.forEach((value, key) => {
      const facet = getFacetSlugFromParam(key);

      if (!facet) {
        return;
      }

      rawSelections[facet] ??= [];
      rawSelections[facet].push(value);
    });

    return normalizeFacetSelections(rawSelections);
  }, [searchParams]);

  const toggleFacetOption = useCallback(
    (facetSlug: string, optionSlug: string) => {
      const facet = facetSlug.trim();
      const option = optionSlug.trim();

      if (!facet || !option) {
        return;
      }

      const currentOptions = facets[facet] ?? [];

      const nextOptions = currentOptions.includes(option)
        ? currentOptions.filter((currentOption) => currentOption !== option)
        : [...currentOptions, option];

      const nextSelections = {
        ...facets,
        [facet]: nextOptions,
      };

      const nextParams = new URLSearchParams(searchParams);

      writeFacetSelections(nextParams, nextSelections);

      nextParams.delete("page");

      setSearchParams(nextParams);
    },
    [facets, searchParams, setSearchParams],
  );

  const pruneFacetSelections = useCallback(
    (availableFacets: AvailableFacet[]) => {
      const nextSelections = getPrunedFacetSelections(facets, availableFacets);

      if (JSON.stringify(nextSelections) === JSON.stringify(facets)) {
        return;
      }

      const nextParams = new URLSearchParams(searchParams);

      writeFacetSelections(nextParams, nextSelections);

      nextParams.delete("page");

      // This is automatic URL cleanup, not a
      // deliberate user navigation step.
      setSearchParams(nextParams, {
        replace: true,
      });
    },
    [facets, searchParams, setSearchParams],
  );

  return {
    facets,
    toggleFacetOption,
    pruneFacetSelections,
  };
}
