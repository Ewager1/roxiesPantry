export type CatalogFilters = {
  brands: string[];
};

export type CatalogFilterKey = keyof CatalogFilters;

export const EMPTY_CATALOG_FILTERS: CatalogFilters = {
  brands: [],
};

// by deduping and ordering the same way, filters will stay a valid cache strategy
export function normalizeFilterValues(values: string[]): string[] {
  return [...new Set(values)].sort();
}
