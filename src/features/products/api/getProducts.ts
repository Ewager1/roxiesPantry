import { graphqlRequest } from "../../../api/graphql";
import type { ProductPage } from "../types";

const PRODUCTS_QUERY = `
  query Products($page: Int, $pageSize: Int) {
  products(page: $page, pageSize: $pageSize) {
    pagination {
      page
      pageSize
      totalItems
      totalPages
      hasNextPage
      hasPreviousPage
    }
    items {
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
        slug
      }
      pet {
        id
        name
        slug
      }
      productType {
        id
        name
        slug
        category {
          id
          name
          slug
        }
      }
    }
  }
}
`;

type ProductsResponse = {
  products: ProductPage;
};

export async function getProducts(page: number): Promise<ProductPage> {
  const data = await graphqlRequest<ProductsResponse>(PRODUCTS_QUERY, {
    page,
  });

  return data.products;
}
