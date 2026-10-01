import type { CatalogFilters } from "../filterLogic/catalogFilters";

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
