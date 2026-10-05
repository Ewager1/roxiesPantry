import { useSearchParams } from "react-router";

import { formatCurrency } from "../../../utils/formatCurrency";

import { useCatalogFilterContext } from "../api/useCatalogFilterContext";
import { useCatalogFilterOptions } from "../api/useCatalogFilterOptions";
import { CATALOG_FILTER_PARAMS } from "../constants";
import { removeFacetParams } from "../facetLogic/catalogFacets";
import { useCatalogFacets } from "../facetLogic/useCatalogFacets";
import { useCatalogPriceRange } from "../priceLogic/useCatalogPriceRange";

import { useCatalogFilters } from "./useCatalogFilters";

export type ActiveCatalogFilter = {
  id: string;
  label: string;
  remove: () => void;
};

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function useActiveCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { filters, toggleMultiFilter, setCategory } = useCatalogFilters();

  const { facets, toggleFacetOption } = useCatalogFacets();

  const { priceRange, setPriceRange } = useCatalogPriceRange();

  const { data: filterOptions } = useCatalogFilterOptions();

  const { data: filterContext } = useCatalogFilterContext(
    filters.category,
    filters.productTypes,
  );

  const activeFilters: ActiveCatalogFilter[] = [];

  function getGlobalOptionName(
    type: "brands" | "pets" | "categories" | "productTypes",
    slug: string,
  ) {
    return (
      filterOptions?.[type].find((option) => option.slug === slug)?.name ??
      humanizeSlug(slug)
    );
  }

  if (priceRange.min !== null || priceRange.max !== null) {
    let label = "";

    if (priceRange.min !== null && priceRange.max !== null) {
      label = `${formatCurrency(priceRange.min)}–${formatCurrency(
        priceRange.max,
      )}`;
    } else if (priceRange.min !== null) {
      label = `${formatCurrency(priceRange.min)}+`;
    } else if (priceRange.max !== null) {
      label = `Up to ${formatCurrency(priceRange.max)}`;
    }

    activeFilters.push({
      id: "price",
      label,
      remove: () =>
        setPriceRange({
          min: null,
          max: null,
        }),
    });
  }

  filters.pets.forEach((slug) => {
    activeFilters.push({
      id: `pet:${slug}`,
      label: getGlobalOptionName("pets", slug),
      remove: () => toggleMultiFilter("pets", slug),
    });
  });

  filters.brands.forEach((slug) => {
    activeFilters.push({
      id: `brand:${slug}`,
      label: getGlobalOptionName("brands", slug),
      remove: () => toggleMultiFilter("brands", slug),
    });
  });

  if (filters.category) {
    const categorySlug = filters.category;

    activeFilters.push({
      id: `category:${categorySlug}`,
      label: getGlobalOptionName("categories", categorySlug),
      remove: () => setCategory(null),
    });
  }

  filters.productTypes.forEach((slug) => {
    activeFilters.push({
      id: `productType:${slug}`,
      label: getGlobalOptionName("productTypes", slug),
      remove: () => toggleMultiFilter("productTypes", slug),
    });
  });

  Object.entries(facets).forEach(([facetSlug, optionSlugs]) => {
    const facet = filterContext?.facets.find(
      (candidate) => candidate.slug === facetSlug,
    );

    const facetName = facet?.name ?? humanizeSlug(facetSlug);

    optionSlugs.forEach((optionSlug) => {
      const optionName =
        facet?.options.find((option) => option.slug === optionSlug)?.name ??
        humanizeSlug(optionSlug);

      activeFilters.push({
        id: `facet:${facetSlug}:${optionSlug}`,

        label: `${facetName}: ${optionName}`,

        remove: () => toggleFacetOption(facetSlug, optionSlug),
      });
    });
  });

  function clearAllFilters() {
    const nextParams = new URLSearchParams(searchParams);

    Object.values(CATALOG_FILTER_PARAMS).forEach((param) => {
      nextParams.delete(param);
    });

    nextParams.delete("minPrice");
    nextParams.delete("maxPrice");

    removeFacetParams(nextParams);

    nextParams.delete("page");

    // Search, Sort, and Result Mode intentionally survive.
    setSearchParams(nextParams, {
      preventScrollReset: true,
    });
  }

  return {
    activeFilters,
    clearAllFilters,
  };
}
