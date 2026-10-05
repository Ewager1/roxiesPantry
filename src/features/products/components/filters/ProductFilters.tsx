import { memo } from "react";

import { useCatalogFilterOptions } from "../../api/useCatalogFilterOptions";
import { useCatalogFilters } from "../../filterLogic/useCatalogFilters";

import { FilterGroup } from "./FilterGroup";
import { PriceRangeFilter } from "./PriceRangeFilter";

import styles from "./ProductFilters.module.css";

function ProductFiltersComponent() {
  const { data, isPending, isError } = useCatalogFilterOptions();

  const { filters, toggleFilter } = useCatalogFilters();

  if (isPending) {
    return <p>Loading filters...</p>;
  }

  if (isError) {
    return <p>Unable to load filters.</p>;
  }

  return (
    <aside className={styles.filters} aria-label="Product filters">
      <FilterGroup
        label="Brand"
        options={data.brands}
        selectedValues={filters.brands}
        onToggle={(brand) => toggleFilter("brands", brand)}
      />

      <FilterGroup
        label="Pet"
        options={data.pets}
        selectedValues={filters.pets}
        onToggle={(pet) => toggleFilter("pets", pet)}
      />

      <FilterGroup
        label="Category"
        options={data.categories}
        selectedValues={filters.categories}
        onToggle={(category) => toggleFilter("categories", category)}
      />

      <FilterGroup
        label="Product Type"
        options={data.productTypes}
        selectedValues={filters.productTypes}
        onToggle={(productType) => toggleFilter("productTypes", productType)}
      />

      <PriceRangeFilter />
    </aside>
  );
}

export const ProductFilters = memo(ProductFiltersComponent);
