import { normalizeFilterValues } from "../filterLogic/catalogFilters";

export const FACET_PARAM_PREFIX = "facet.";

export type CatalogFacetSelections = Record<string, string[]>;

export type AvailableFacet = {
  slug: string;
  options: Array<{
    slug: string;
  }>;
};

export function normalizeFacetSelections(
  selections: CatalogFacetSelections,
): CatalogFacetSelections {
  const normalizedEntries = Object.entries(selections)
    .map(([facet, options]) => {
      return [facet.trim(), normalizeFilterValues(options)] as const;
    })
    .filter(([facet, options]) => facet.length > 0 && options.length > 0)
    .sort(([facetA], [facetB]) => facetA.localeCompare(facetB));

  return Object.fromEntries(normalizedEntries);
}

export function getFacetSlugFromParam(paramName: string): string | null {
  if (!paramName.startsWith(FACET_PARAM_PREFIX)) {
    return null;
  }

  const facetSlug = paramName.slice(FACET_PARAM_PREFIX.length).trim();

  return facetSlug || null;
}

export function removeFacetParams(searchParams: URLSearchParams) {
  const facetKeys = new Set<string>();

  searchParams.forEach((_value, key) => {
    if (key.startsWith(FACET_PARAM_PREFIX)) {
      facetKeys.add(key);
    }
  });

  facetKeys.forEach((key) => {
    searchParams.delete(key);
  });
}

export function writeFacetSelections(
  searchParams: URLSearchParams,
  selections: CatalogFacetSelections,
) {
  removeFacetParams(searchParams);

  const normalized = normalizeFacetSelections(selections);

  Object.entries(normalized).forEach(([facet, options]) => {
    options.forEach((option) => {
      searchParams.append(`${FACET_PARAM_PREFIX}${facet}`, option);
    });
  });
}

export function pruneFacetSelections(
  selections: CatalogFacetSelections,
  availableFacets: AvailableFacet[],
): CatalogFacetSelections {
  const validOptionsByFacet = new Map(
    availableFacets.map((facet) => [
      facet.slug,
      new Set(facet.options.map((option) => option.slug)),
    ]),
  );

  const nextSelections: CatalogFacetSelections = {};

  Object.entries(selections).forEach(([facet, options]) => {
    const validOptions = validOptionsByFacet.get(facet);

    if (!validOptions) {
      return;
    }

    nextSelections[facet] = options.filter((option) =>
      validOptions.has(option),
    );
  });

  return normalizeFacetSelections(nextSelections);
}

export function toFacetSelectionInputs(selections: CatalogFacetSelections) {
  return Object.entries(normalizeFacetSelections(selections)).map(
    ([facet, options]) => ({
      facet,
      options,
    }),
  );
}
