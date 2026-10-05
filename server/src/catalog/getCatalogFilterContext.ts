import { prisma } from "../lib/prisma.js";

type GetCatalogFilterContextArgs = {
  category?: string | null;
  productTypes?: string[];
};

function normalizeSlugs(values: string[]): string[] {
  return [
    ...new Set(values.map((value) => value.trim()).filter(Boolean)),
  ].sort();
}

export async function getCatalogFilterContext({
  category,
  productTypes = [],
}: GetCatalogFilterContextArgs) {
  const categorySlug = category?.trim() ?? "";

  // Product types and facets do not have useful context
  // until the user has chosen a category.
  if (!categorySlug) {
    return {
      productTypes: [],
      facets: [],
    };
  }

  const availableProductTypes = await prisma.productType.findMany({
    where: {
      category: {
        slug: categorySlug,
      },
    },

    orderBy: {
      name: "asc",
    },

    include: {
      category: true,

      facets: {
        include: {
          facet: true,
        },
      },
    },
  });

  if (availableProductTypes.length === 0) {
    return {
      productTypes: [],
      facets: [],
    };
  }

  const selectedProductTypeSlugs = new Set(normalizeSlugs(productTypes));

  const selectedProductTypes = availableProductTypes.filter((productType) =>
    selectedProductTypeSlugs.has(productType.slug),
  );

  // No explicit Product Type selection means the entire
  // selected Category defines the current facet context.
  const activeProductTypes =
    selectedProductTypes.length > 0
      ? selectedProductTypes
      : availableProductTypes;

  const firstProductType = activeProductTypes[0];

  if (!firstProductType) {
    return {
      productTypes: availableProductTypes,
      facets: [],
    };
  }

  const remainingProductTypes = activeProductTypes.slice(1);

  const sharedFacetIds = new Set(
    firstProductType.facets.map((productTypeFacet) => productTypeFacet.facetId),
  );
  // Only expose facets supported by every currently active
  // Product Type. This prevents unrelated facet groups from
  // appearing together.
  remainingProductTypes.forEach((productType) => {
    const productTypeFacetIds = new Set(
      productType.facets.map((productTypeFacet) => productTypeFacet.facetId),
    );

    sharedFacetIds.forEach((facetId) => {
      if (!productTypeFacetIds.has(facetId)) {
        sharedFacetIds.delete(facetId);
      }
    });
  });

  if (sharedFacetIds.size === 0) {
    return {
      productTypes: availableProductTypes,
      facets: [],
    };
  }

  const activeProductTypeIds = activeProductTypes.map(
    (productType) => productType.id,
  );

  const facets = await prisma.facet.findMany({
    where: {
      id: {
        in: [...sharedFacetIds],
      },
    },

    orderBy: {
      name: "asc",
    },

    include: {
      options: {
        // Only return options actually assigned to products
        // in the current Product Type context.
        where: {
          products: {
            some: {
              product: {
                productTypeId: {
                  in: activeProductTypeIds,
                },
              },
            },
          },
        },

        orderBy: {
          name: "asc",
        },
      },
    },
  });

  return {
    productTypes: availableProductTypes,
    facets,
  };
}
