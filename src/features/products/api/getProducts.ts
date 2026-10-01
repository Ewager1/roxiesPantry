import { graphqlRequest } from "../../../api/graphql";
import type { ProductPage } from "../types";
import type { CatalogFilters } from "../filterLogic/catalogFilters";

const PRODUCTS_QUERY = `
  query Products(
    $page: Int
    $brands: [String!]
    $pets: [String!]
    $categories: [String!]
    $productTypes: [String!]
  ) {
    products(
      page: $page
      brands: $brands
      pets: $pets
      categories: $categories
      productTypes: $productTypes
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
  filters: CatalogFilters;
};

export async function getProducts({
  page,
  filters,
}: GetProductsOptions): Promise<ProductPage> {
  const data = await graphqlRequest<ProductsResponse>(PRODUCTS_QUERY, {
    page,
    brands: filters.brands,
    pets: filters.pets,
    categories: filters.categories,
    productTypes: filters.productTypes,
  });

  return data.products;
}
