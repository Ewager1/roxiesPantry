export const CATALOG_SORT_OPTIONS = {
  nameAscending: "name-ascending",
  priceLowToHigh: "price-low-to-high",
  priceHighToLow: "price-high-to-low",
  rating: "rating",
} as const;

export type CatalogSort =
  typeof CATALOG_SORT_OPTIONS[keyof typeof CATALOG_SORT_OPTIONS];

export const DEFAULT_CATALOG_SORT: CatalogSort =
  CATALOG_SORT_OPTIONS.nameAscending;
