import { graphqlRequest } from "../../../api/graphql";
import type { ProductPage } from "../types";
import type { CatalogQuery } from "../catalogQuery";

const PRODUCTS_QUERY = `
  query Products(
    $page: Int
    $brands: [String!]
    $pets: [String!]
    $categories: [String!]
    $productTypes: [String!]
    $sort: String
    $search: String
  ) {
    products(
      page: $page
      brands: $brands
      pets: $pets
      categories: $categories
      productTypes: $productTypes
      sort: $sort
      search: $search
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
  query: CatalogQuery;
};

export async function getProducts({
  page,
  query,
}: GetProductsOptions): Promise<ProductPage> {
  const data = await graphqlRequest<ProductsResponse>(PRODUCTS_QUERY, {
    page,
    brands: query.filters.brands,
    pets: query.filters.pets,
    categories: query.filters.categories,
    productTypes: query.filters.productTypes,
    sort: query.sort,
    search: query.search,
  });

  return data.products;
}
