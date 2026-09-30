import { graphqlRequest } from "../../../api/graphql";
import type { ProductPage } from "../types";

const PRODUCTS_QUERY = `
  query Products(
    $page: Int
    $brands: [String!]
  ) {
    products(
      page: $page
      brands: $brands
    ) {
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

type GetProductsOptions = {
  page: number;
  brands?: string[];
};

export async function getProducts({
  page,
  brands,
}: GetProductsOptions): Promise<ProductPage> {
  const data = await graphqlRequest<ProductsResponse>(PRODUCTS_QUERY, {
    page,
    brands,
  });

  return data.products;
}
