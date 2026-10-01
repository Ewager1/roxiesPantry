export type CatalogFilters = {
  brands: string[];
  pets: string[];
  categories: string[];
  productTypes: string[];
};

export type CatalogFilterKey = keyof CatalogFilters;

export const EMPTY_CATALOG_FILTERS: CatalogFilters = {
  brands: [],
  pets: [],
  categories: [],
  productTypes: [],
};

// Remove empty and duplicate values, then sort so equivalent
// filters produce stable cache keys.
export function normalizeFilterValues(values: string[]): string[] {
  return [
    ...new Set(values.map((value) => value.trim()).filter(Boolean)),
  ].sort();
}
