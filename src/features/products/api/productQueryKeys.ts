import type { CatalogQuery } from "../catalogQuery";

// Include all catalog query state in the key so each distinct
// result set and ordering receives its own cache entry.
export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,

  list: (page: number, query: CatalogQuery) =>
    [
      ...productKeys.lists(),
      {
        page,
        query,
      },
    ] as const,

  infinite: (query: CatalogQuery) =>
    [
      ...productKeys.all,
      "infinite",
      {
        query,
      },
    ] as const,
};
