import { prisma } from "../lib/prisma.js";

export const typeDefs = `#graphql
  type Brand {
    id: ID!
    name: String!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
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
    brand: Brand!
    category: Category!
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
          brand: true,
          category: true,
        },
      });
    },
  },
};
