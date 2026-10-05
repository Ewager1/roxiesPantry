export type CatalogFilters = {
  brands: string[];
  pets: string[];
  category: string | null;
  productTypes: string[];
};

export type MultiCatalogFilterKey = "brands" | "pets" | "productTypes";

export const EMPTY_CATALOG_FILTERS: CatalogFilters = {
  brands: [],
  pets: [],
  category: null,
  productTypes: [],
};

// Remove empty and duplicate values, then sort so equivalent
// filters produce stable cache keys.
export function normalizeFilterValues(values: string[]): string[] {
  return [
    ...new Set(values.map((value) => value.trim()).filter(Boolean)),
  ].sort();
}

export function normalizeSingleFilterValue(
  value: string | null,
): string | null {
  const normalized = value?.trim() ?? "";

  return normalized || null;
}
