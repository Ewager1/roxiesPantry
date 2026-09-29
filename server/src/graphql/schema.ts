import { prisma } from "../lib/prisma.js";

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
    products: [Product!]!
  }
`;

export const resolvers = {
  Query: {
    products: async () => {
      return prisma.product.findMany({
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
    },
  },

  Product: {
    price: (product: { price: unknown }) => String(product.price),
  },
};
