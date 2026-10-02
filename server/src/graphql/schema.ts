import { prisma } from "../lib/prisma.js";

import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "../constants/catalog.js";

export const typeDefs = `#graphql
  type Pet {
    id: ID!
    name: String!
    slug: String!
  }

  type Brand {
    id: ID!
    name: String!
    slug: String!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
  }

  type ProductType {
    id: ID!
    name: String!
    slug: String!
    category: Category!
  }

  type Product {
    id: ID!
    name: String!
    slug: String!
    description: String!
    price: String!
    imageUrl: String!
    rating: Float
    reviewCount: Int!

    pet: Pet!
    brand: Brand!
    productType: ProductType!
  }

  type Query {
    products(
      page: Int = 1
      pageSize: Int = ${DEFAULT_PAGE_SIZE}
      brands: [String!]
      pets: [String!]
      categories: [String!]
      productTypes: [String!]
      sort: String = "name-ascending"
      search: String
      minPrice: Float
      maxPrice: Float
    ): ProductPage!

    catalogFilterOptions: CatalogFilterOptions!
  }

  type PaginationInfo {
    page: Int!
    pageSize: Int!
    totalItems: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type ProductPage {
    items: [Product!]!
    pagination: PaginationInfo!
  }

  type CatalogFilterOptions {
    brands: [Brand!]!
    pets: [Pet!]!
    categories: [Category!]!
    productTypes: [ProductType!]!
  }
`;

type ProductsArgs = {
  page?: number;
  pageSize?: number;
  brands?: string[];
  pets?: string[];
  categories?: string[];
  productTypes?: string[];
  sort?: string;
  search?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
};

// Simple relevance tiers keep search ordering predictable without
// introducing a full-text search or fuzzy-matching dependency.
// 0 → exact product-name match
// 1 → full phrase appears in product name
// 2 → other valid multi-field match
function getSearchRelevanceTier(
  productName: string,
  searchPhrase: string,
): number {
  const normalizedName = productName.trim().toLowerCase();
  const normalizedPhrase = searchPhrase.trim().toLowerCase();

  if (normalizedName === normalizedPhrase) {
    return 0;
  }

  if (normalizedName.includes(normalizedPhrase)) {
    return 1;
  }

  return 2;
}

function normalizeSort(sort?: string): string {
  switch (sort) {
    case "price-low-to-high":
    case "price-high-to-low":
    case "rating":
    case "name-ascending":
      return sort;

    default:
      return "name-ascending";
  }
}

export const resolvers = {
  Query: {
    products: async (_parent: unknown, args: ProductsArgs) => {
      const page = Math.max(args.page ?? 1, 1);

      const pageSize = Math.min(
        Math.max(args.pageSize ?? DEFAULT_PAGE_SIZE, MIN_PAGE_SIZE),
        MAX_PAGE_SIZE,
      );

      const skip = (page - 1) * pageSize;

      const filterConditions = [];

      if (args.brands?.length) {
        filterConditions.push({
          brand: {
            slug: {
              in: args.brands,
            },
          },
        });
      }

      if (args.pets?.length) {
        filterConditions.push({
          pet: {
            slug: {
              in: args.pets,
            },
          },
        });
      }

      if (args.categories?.length) {
        filterConditions.push({
          productType: {
            category: {
              slug: {
                in: args.categories,
              },
            },
          },
        });
      }

      if (args.productTypes?.length) {
        filterConditions.push({
          productType: {
            slug: {
              in: args.productTypes,
            },
          },
        });
      }

      // GraphQL nullable price arguments may arrive as null or be omitted.
      // Normalize anything other than a valid non-negative number to undefined
      // so Prisma receives no price bound instead of gte/lte: null.
      const minPrice =
        typeof args.minPrice === "number" &&
        Number.isFinite(args.minPrice) &&
        args.minPrice >= 0
          ? args.minPrice
          : undefined;

      const maxPrice =
        typeof args.maxPrice === "number" &&
        Number.isFinite(args.maxPrice) &&
        args.maxPrice >= 0
          ? args.maxPrice
          : undefined;

      if (minPrice !== undefined || maxPrice !== undefined) {
        filterConditions.push({
          price: {
            ...(minPrice !== undefined && {
              gte: minPrice,
            }),
            ...(maxPrice !== undefined && {
              lte: maxPrice,
            }),
          },
        });
      }

      const searchPhrase = args.search?.trim() ?? "";

      // Search terms are ANDed together, while each term may match any
      // supported product field. This lets "dog bed" match Pet + Category.
      const searchTerms = [
        ...new Set(searchPhrase.split(/\s+/).filter(Boolean)),
      ];

      searchTerms.forEach((term) => {
        filterConditions.push({
          OR: [
            {
              name: {
                contains: term,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: term,
                mode: "insensitive",
              },
            },
            {
              brand: {
                name: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
            {
              pet: {
                name: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
            {
              productType: {
                name: {
                  contains: term,
                  mode: "insensitive",
                },
              },
            },
            {
              productType: {
                category: {
                  name: {
                    contains: term,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        });
      });

      const where = {
        AND: filterConditions,
      };
      const sort = normalizeSort(args.sort);

      const orderBy = (() => {
        switch (sort) {
          case "price-low-to-high":
            return [{ price: "asc" as const }, { id: "asc" as const }];

          case "price-high-to-low":
            return [{ price: "desc" as const }, { id: "asc" as const }];
          case "rating":
            return [
              {
                rating: {
                  sort: "desc" as const,
                  nulls: "last" as const,
                },
              },
              { reviewCount: "desc" as const },
              { id: "asc" as const },
            ];
          case "name-ascending":
          default:
            return [{ name: "asc" as const }, { id: "asc" as const }];
        }
      })();

      // Default search ordering favors relevance. An explicit price or
      // rating sort instead lets search determine eligibility while the
      // selected sort determines result order.
      const shouldRankByRelevance =
        Boolean(searchPhrase) && sort === "name-ascending";

      let items;
      let totalItems;

      if (shouldRankByRelevance) {
        // Relevance must be calculated before pagination. Otherwise a
        // highly relevant match outside the initial page could be hidden.
        const matchingItems = await prisma.product.findMany({
          where,
          orderBy,

          include: {
            pet: true,
            brand: true,
            productType: {
              include: {
                category: true,
              },
            },
          },
        });

        matchingItems.sort((a, b) => {
          return (
            getSearchRelevanceTier(a.name, searchPhrase) -
            getSearchRelevanceTier(b.name, searchPhrase)
          );
        });

        totalItems = matchingItems.length;

        items = matchingItems.slice(skip, skip + pageSize);
      } else {
        // Normal browsing and explicit sorts can remain database-paginated,
        // avoiding the cost of loading the entire matching result set.
        [items, totalItems] = await Promise.all([
          prisma.product.findMany({
            skip,
            take: pageSize,
            where,
            orderBy,

            include: {
              pet: true,
              brand: true,
              productType: {
                include: {
                  category: true,
                },
              },
            },
          }),

          prisma.product.count({
            where,
          }),
        ]);
      }

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        items,

        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    },

    catalogFilterOptions: async () => {
      const [brands, pets, categories, productTypes] = await Promise.all([
        prisma.brand.findMany({
          orderBy: {
            name: "asc",
          },
        }),

        prisma.pet.findMany({
          orderBy: {
            name: "asc",
          },
        }),

        prisma.category.findMany({
          orderBy: {
            name: "asc",
          },
        }),

        prisma.productType.findMany({
          orderBy: {
            name: "asc",
          },

          include: {
            category: true,
          },
        }),
      ]);

      return {
        brands,
        pets,
        categories,
        productTypes,
      };
    },
  },

  Product: {
    price: (product: { price: unknown }) => String(product.price),
  },
};
