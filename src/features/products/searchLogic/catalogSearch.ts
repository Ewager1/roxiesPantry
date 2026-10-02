export const CATALOG_SEARCH_PARAM = "search";

export function normalizeCatalogSearch(value: string | null): string {
  return value?.trim() ?? "";
}
