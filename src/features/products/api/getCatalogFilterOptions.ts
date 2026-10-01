import { graphqlRequest } from "../../../api/graphql";

// Responsible for getting the filter options for the user
export type CatalogFilterOption = {
  id: string;
  name: string;
  slug: string;
};

export type CatalogFilterOptions = {
  brands: CatalogFilterOption[];
  pets: CatalogFilterOption[];
  categories: CatalogFilterOption[];
  productTypes: CatalogFilterOption[];
};

type CatalogFilterOptionsResponse = {
  catalogFilterOptions: CatalogFilterOptions;
};

const CATALOG_FILTER_OPTIONS_QUERY = `
  query CatalogFilterOptions {
    catalogFilterOptions {
      brands {
        id
        name
        slug
      }

      pets {
        id
        name
        slug
      }

      categories {
        id
        name
        slug
      }

      productTypes {
        id
        name
        slug
      }
    }
  }
`;

export async function getCatalogFilterOptions(): Promise<CatalogFilterOptions> {
  const data = await graphqlRequest<CatalogFilterOptionsResponse>(
    CATALOG_FILTER_OPTIONS_QUERY,
  );

  return data.catalogFilterOptions;
}
