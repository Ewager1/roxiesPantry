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
      pageSize: Int =${DEFAULT_PAGE_SIZE}
      brands: [String!]
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
}
`;

type ProductsArgs = {
  page?: number;
  pageSize?: number;
  brands?: string[];
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

      const where = args.brands?.length
        ? {
            brand: {
              slug: {
                in: args.brands,
              },
            },
          }
        : {};

      const items = await prisma.product.findMany({
        skip,
        take: pageSize,
        where,
        orderBy: {
          id: "asc",
        },

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
      const brands = await prisma.brand.findMany({
        orderBy: {
          name: "asc",
        },
      });

      return {
        brands,
      };
    },
  },

  Product: {
    price: (product: { price: unknown }) => String(product.price),
  },
};
