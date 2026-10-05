import { useEffect } from "react";
import { useSearchParams } from "react-router";

import type { CatalogFilterContext } from "../api/getCatalogFilterContext";
import {
  pruneFacetSelections,
  writeFacetSelections,
  type CatalogFacetSelections,
} from "../facetLogic/catalogFacets";
import { CATALOG_FILTER_PARAMS } from "../constants";

type UseCatalogHierarchyCanonicalizationArgs = {
  category: string | null;
  productTypes: string[];
  facets: CatalogFacetSelections;
  filterContext: CatalogFilterContext | undefined;
  validCategorySlugs: string[];
};

export function useCatalogHierarchyCanonicalization({
  category,
  productTypes,
  facets,
  filterContext,
  validCategorySlugs,
}: UseCatalogHierarchyCanonicalizationArgs) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Wait until the global Category metadata
    // has loaded before validating the Category.
    if (validCategorySlugs.length === 0) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);

    const categoryIsValid =
      category !== null && validCategorySlugs.includes(category);

    // No valid Category means Product Type and
    // dynamic facets have no valid parent context.
    if (!categoryIsValid) {
      nextParams.delete(CATALOG_FILTER_PARAMS.productTypes);

      writeFacetSelections(nextParams, {});

      if (category !== null) {
        nextParams.delete(CATALOG_FILTER_PARAMS.category);
      }

      nextParams.delete("page");

      if (nextParams.toString() !== searchParams.toString()) {
        setSearchParams(nextParams, {
          replace: true,
        });
      }

      return;
    }

    // A valid Category exists, but its contextual
    // Product Type/facet metadata has not loaded yet.
    if (!filterContext) {
      return;
    }

    const validProductTypes = new Set(
      filterContext.productTypes.map((productType) => productType.slug),
    );

    const nextProductTypes = productTypes.filter((productType) =>
      validProductTypes.has(productType),
    );

    const nextFacets = pruneFacetSelections(facets, filterContext.facets);

    nextParams.delete(CATALOG_FILTER_PARAMS.productTypes);

    nextProductTypes.forEach((productType) => {
      nextParams.append(CATALOG_FILTER_PARAMS.productTypes, productType);
    });

    writeFacetSelections(nextParams, nextFacets);

    if (nextParams.toString() === searchParams.toString()) {
      return;
    }

    // Automatic cleanup should not create another
    // browser-history entry.
    nextParams.delete("page");

    setSearchParams(nextParams, {
      replace: true,
    });
  }, [
    category,
    productTypes,
    facets,
    filterContext,
    validCategorySlugs,
    searchParams,
    setSearchParams,
  ]);
}
