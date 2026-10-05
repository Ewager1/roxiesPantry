import type { CatalogQuery } from "../../products/catalogQuery";

export type ProductCacheEntry = {
  id: string;
  type: "Paginated" | "Infinite";
  page: number | null;
  pageCount: number | null;
  inputs: string[];
};

type PaginatedQueryKey = readonly [
  "products",
  "list",
  {
    page: number;
    query: CatalogQuery;
  },
];

type InfiniteQueryKey = readonly [
  "products",
  "infinite",
  {
    query: CatalogQuery;
  },
];

function formatPriceRange(query: CatalogQuery): string | null {
  const { min, max } = query.priceRange;

  if (min !== null && max !== null) {
    return `$${min}–$${max}`;
  }

  if (min !== null) {
    return `$${min}+`;
  }

  if (max !== null) {
    return `Up to $${max}`;
  }

  return null;
}

function formatCatalogInputs(query: CatalogQuery): string[] {
  const inputs: string[] = [];

  if (query.search) {
    inputs.push(`Search: "${query.search}"`);
  }

  if (query.filters.pets.length > 0) {
    inputs.push(query.filters.pets.join(", "));
  }

  if (query.filters.categories.length > 0) {
    inputs.push(query.filters.categories.join(", "));
  }

  if (query.filters.productTypes.length > 0) {
    inputs.push(query.filters.productTypes.join(", "));
  }

  if (query.filters.brands.length > 0) {
    inputs.push(query.filters.brands.join(", "));
  }

  const priceRange = formatPriceRange(query);

  if (priceRange) {
    inputs.push(priceRange);
  }

  if (query.sort !== "name-ascending") {
    inputs.push(`Sort: ${query.sort}`);
  }

  if (inputs.length === 0) {
    inputs.push("Default catalog");
  }

  return inputs;
}

function getInfinitePageCount(data: unknown): number {
  if (typeof data !== "object" || data === null || !("pages" in data)) {
    return 0;
  }

  const pages = (
    data as {
      pages?: unknown;
    }
  ).pages;

  return Array.isArray(pages) ? pages.length : 0;
}

export function parseProductQuery(
  queryKey: readonly unknown[],
  data: unknown,
): ProductCacheEntry | null {
  if (queryKey[0] !== "products") {
    return null;
  }

  if (queryKey[1] === "list") {
    const [, , config] = queryKey as PaginatedQueryKey;

    return {
      id: JSON.stringify(queryKey),
      type: "Paginated",
      page: config.page,
      pageCount: null,
      inputs: formatCatalogInputs(config.query),
    };
  }

  if (queryKey[1] === "infinite") {
    const [, , config] = queryKey as InfiniteQueryKey;

    return {
      id: JSON.stringify(queryKey),
      type: "Infinite",
      page: null,
      pageCount: getInfinitePageCount(data),
      inputs: formatCatalogInputs(config.query),
    };
  }

  return null;
}
