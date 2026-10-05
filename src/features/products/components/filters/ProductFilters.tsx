import { memo } from "react";

import { useCatalogFilterContext } from "../../api/useCatalogFilterContext";
import { useCatalogFilterOptions } from "../../api/useCatalogFilterOptions";
import { useCatalogFacets } from "../../facetLogic/useCatalogFacets";
import { useCatalogFilters } from "../../filterLogic/useCatalogFilters";
import { useCatalogHierarchyCanonicalization } from "../../filterLogic/useCatalogHierarchyCannonicalization";
import { PriceRangeFilter } from "./PriceRangeFilter";

import { FilterGroup } from "./FilterGroup";
import { SingleSelectFilterGroup } from "./SingleSelectFilterGroup";

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
    return (
      <aside className={styles.filters} aria-label="Product filters">
        <section className={styles.filterCard}>
          <p className={styles.status}>Loading filters...</p>
        </section>
      </aside>
    );
  }

  if (isError || !data) {
    return (
      <aside className={styles.filters} aria-label="Product filters">
        <section className={styles.filterCard}>
          <p className={styles.status}>Unable to load filters.</p>
        </section>
      </aside>
    );
  }

  const selectedCategoryName = filters.category
    ? data.categories.find((category) => category.slug === filters.category)
        ?.name ?? filters.category
    : null;

  return (
    <aside className={styles.filters} aria-label="Product filters">
      <section className={styles.filterCard}>
        <PriceRangeFilter />
      </section>

      <section className={styles.filterCard}>
        <FilterGroup
          label="Pet"
          options={data.pets}
          selectedValues={filters.pets}
          onToggle={(pet) => toggleMultiFilter("pets", pet)}
        />
      </section>

      <section className={styles.filterCard}>
        <FilterGroup
          label="Brand"
          options={data.brands}
          selectedValues={filters.brands}
          onToggle={(brand) => toggleMultiFilter("brands", brand)}
        />
      </section>

      <section className={styles.filterCard}>
        <SingleSelectFilterGroup
          label="Category"
          name="category"
          options={data.categories}
          selectedValue={filters.category}
          allLabel="All Categories"
          onChange={setCategory}
        />

        {filters.category && (
          <div className={styles.categoryDetails}>
            <h2 className={styles.categoryName}>{selectedCategoryName}</h2>

            {isContextPending && (
              <p className={styles.status}>Loading options...</p>
            )}

            {isContextError && (
              <p className={styles.status}>Unable to load options.</p>
            )}

            {filterContext && (
              <div className={styles.detailGroups}>
                <FilterGroup
                  label="Product Type"
                  options={filterContext.productTypes}
                  selectedValues={filters.productTypes}
                  onToggle={(productType) =>
                    toggleMultiFilter("productTypes", productType)
                  }
                />

                {filterContext.facets.map((facet) => (
                  <FilterGroup
                    key={facet.id}
                    label={facet.name}
                    options={facet.options}
                    selectedValues={facets[facet.slug] ?? []}
                    onToggle={(option) => toggleFacetOption(facet.slug, option)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </aside>
  );
}

export const ProductFilters = memo(ProductFiltersComponent);
