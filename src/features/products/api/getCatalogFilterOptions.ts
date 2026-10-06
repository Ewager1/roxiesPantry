import { graphqlRequest } from "../../../api/graphql";

export type CatalogFilterOption = {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
};

export type CatalogCountFilterOption = CatalogFilterOption & {
  productCount: number;
};

export type CatalogFilterOptions = {
  brands: CatalogCountFilterOption[];
  pets: CatalogCountFilterOption[];
  categories: CatalogCountFilterOption[];
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
        productCount
      }

      pets {
        id
        name
        slug
        productCount
      }

      categories {
        id
        name
        slug
        productCount
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
