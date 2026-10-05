import { graphqlRequest } from "../../../api/graphql";

export type CatalogContextOption = {
  id: string;
  name: string;
  slug: string;
};

export type CatalogFacetOption = {
  id: string;
  name: string;
  slug: string;
};

export type CatalogFacet = {
  id: string;
  name: string;
  slug: string;
  options: CatalogFacetOption[];
};

export type CatalogFilterContext = {
  productTypes: CatalogContextOption[];
  facets: CatalogFacet[];
};

type CatalogFilterContextResponse = {
  catalogFilterContext: CatalogFilterContext;
};

const CATALOG_FILTER_CONTEXT_QUERY = `
  query CatalogFilterContext(
    $category: String
    $productTypes: [String!]
  ) {
    catalogFilterContext(
      category: $category
      productTypes: $productTypes
    ) {
      productTypes {
        id
        name
        slug
      }

      facets {
        id
        name
        slug

        options {
          id
          name
          slug
        }
      }
    }
  }
`;

export async function getCatalogFilterContext(
  category: string,
  productTypes: string[],
): Promise<CatalogFilterContext> {
  const data = await graphqlRequest<CatalogFilterContextResponse>(
    CATALOG_FILTER_CONTEXT_QUERY,
    {
      category,
      productTypes,
    },
  );

  return data.catalogFilterContext;
}
