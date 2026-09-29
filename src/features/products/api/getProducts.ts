import { graphqlRequest } from "../../../api/graphql";
import type { Product } from "../types";

const PRODUCTS_QUERY = `
  query Products {
    products {
      id
      name
      slug
      description
      price
      imageUrl
      rating
      reviewCount
      brand {
        id
        name
      }
      category {
        id
        name
        slug
      }
    }
  }
`;

type ProductsResponse = {
  products: Product[];
};

export async function getProducts(): Promise<Product[]> {
  const data = await graphqlRequest<ProductsResponse>(PRODUCTS_QUERY);

  return data.products;
}
