import type { CatalogFilters } from "../filters/catalogFilters";

// Filters are set here then ingested everywhere else,
// making it more scalable to add filters in futute
export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,

  list: (page: number, filters: CatalogFilters) =>
    [
      ...productKeys.lists(),
      {
        page,
        filters,
      },
    ] as const,

  infinite: (filters: CatalogFilters) =>
    [
      ...productKeys.all,
      "infinite",
      {
        filters,
      },
    ] as const,
};
