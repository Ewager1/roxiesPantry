import { describe, expect, it } from "vitest";

import type { CatalogQuery } from "../catalogQuery";
import { productKeys } from "./productQueryKeys";

const baseQuery: CatalogQuery = {
  filters: {
    brands: [],
    pets: [],
    category: null,
    productTypes: [],
  },
  facets: {},
  sort: "name-ascending",
  search: "",
  priceRange: {
    min: null,
    max: null,
  },
};

describe("productKeys", () => {
  it("creates different keys for different pages", () => {
    expect(
      productKeys.list(1, baseQuery),
    ).not.toEqual(
      productKeys.list(2, baseQuery),
    );
  });

  it("creates different keys when catalog query state changes", () => {
    const filteredQuery: CatalogQuery = {
      ...baseQuery,
      filters: {
        ...baseQuery.filters,
        pets: ["dog"],
      },
    };

    expect(
      productKeys.list(1, baseQuery),
    ).not.toEqual(
      productKeys.list(1, filteredQuery),
    );
  });

  it("keeps paginated and infinite cache shapes separate", () => {
    expect(
      productKeys.list(1, baseQuery),
    ).not.toEqual(
      productKeys.infinite(baseQuery),
    );
  });

  it("shares the products root key for cache invalidation", () => {
    expect(
      productKeys.list(1, baseQuery).slice(0, 1),
    ).toEqual(productKeys.all);

    expect(
      productKeys.infinite(baseQuery).slice(0, 1),
    ).toEqual(productKeys.all);
  });
});
