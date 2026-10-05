import { memo } from "react";

import { useCatalogFilterContext } from "../../api/useCatalogFilterContext";
import { useCatalogFilterOptions } from "../../api/useCatalogFilterOptions";
import { useCatalogFilters } from "../../filterLogic/useCatalogFilters";
import { useCatalogFacets } from "../../facetLogic/useCatalogFacets";

import { FilterGroup } from "./FilterGroup";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { SingleSelectFilterGroup } from "./SingleSelectFilterGroup";
import { useCatalogHierarchyCanonicalization } from "../../filterLogic/useCatalogHierarchyCannonicalization";

import styles from "./ProductFilters.module.css";

function ProductFiltersComponent() {
  const { data, isPending, isError } = useCatalogFilterOptions();

  const { filters, toggleMultiFilter, setCategory } = useCatalogFilters();

  const { facets, toggleFacetOption } = useCatalogFacets();

  const {
    data: filterContext,
    isPending: isContextPending,
    isError: isContextError,
  } = useCatalogFilterContext(filters.category, filters.productTypes);

  useCatalogHierarchyCanonicalization({
    category: filters.category,
    productTypes: filters.productTypes,
    facets,
    filterContext,
    validCategorySlugs: data?.categories.map((category) => category.slug) ?? [],
  });

  if (isPending) {
    return <p>Loading filters...</p>;
  }

  if (isError) {
    return <p>Unable to load filters.</p>;
  }

  return (
    <aside className={styles.filters} aria-label="Product filters">
      <SingleSelectFilterGroup
        label="Category"
        name="category"
        allLabel="All Categories"
        options={data.categories}
        selectedValue={filters.category}
        onChange={setCategory}
      />

      <FilterGroup
        label="Pet"
        options={data.pets}
        selectedValues={filters.pets}
        onToggle={(pet) => toggleMultiFilter("pets", pet)}
      />

      <FilterGroup
        label="Brand"
        options={data.brands}
        selectedValues={filters.brands}
        onToggle={(brand) => toggleMultiFilter("brands", brand)}
      />

      {filters.category && (
        <>
          {isContextPending && <p>Loading product types...</p>}

          {isContextError && <p>Unable to load product types.</p>}

          {filterContext && !isContextPending && !isContextError && (
            <FilterGroup
              label="Product Type"
              options={filterContext.productTypes}
              selectedValues={filters.productTypes}
              onToggle={(productType) =>
                toggleMultiFilter("productTypes", productType)
              }
            />
          )}
        </>
      )}

      {filterContext?.facets.map((facet) => (
        <FilterGroup
          key={facet.id}
          label={facet.name}
          options={facet.options}
          selectedValues={facets[facet.slug] ?? []}
          onToggle={(option) => toggleFacetOption(facet.slug, option)}
        />
      ))}

      <PriceRangeFilter />
    </aside>
  );
}

export const ProductFilters = memo(ProductFiltersComponent);
