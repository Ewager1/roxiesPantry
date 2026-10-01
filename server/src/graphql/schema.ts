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
};

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

      const where = {
        AND: filterConditions,
      };

      const orderBy = (() => {
        switch (args.sort) {
          case "price-low-to-high":
            return [{ price: "asc" as const }, { id: "asc" as const }];

          case "price-high-to-low":
            return [{ price: "desc" as const }, { id: "asc" as const }];

          case "rating":
            return [
              { rating: "desc" as const },
              { reviewCount: "desc" as const },
              { id: "asc" as const },
            ];

          case "name-ascending":
          default:
            return [{ name: "asc" as const }, { id: "asc" as const }];
        }
      })();

      const items = await prisma.product.findMany({
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
      });

      const totalItems = await prisma.product.count({
        where,
      });

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
