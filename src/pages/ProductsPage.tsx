import { DemoWorksite } from "../features/demo/components/DemoWorksite";
import { useResultMode } from "../features/demo/useResultMode";

import { CatalogSearchInput } from "../features/products/components/CatalogSearchInput";
import { CatalogSortSelect } from "../features/products/components/CatalogSortSelect";
import { InfiniteProductResults } from "../features/products/components/InfiniteProductResults";
import { PaginatedProductResults } from "../features/products/components/PaginatedProductResults";
import { ProductFilters } from "../features/products/components/filters/ProductFilters";

import { useCatalogQuery } from "../features/products/useCatalogQuery";

import styles from "./ProductsPage.module.css";

export function ProductsPage() {
  const query = useCatalogQuery();

  const { view, changeView } = useResultMode(query);

  return (
    <>
      <DemoWorksite view={view} onViewChange={changeView} />

      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Products</h1>

          <p className={styles.subtitle}>Browse Roxie's Pantry</p>
        </header>

        <div className={styles.catalogLayout}>
          <ProductFilters />

          <section className={styles.results}>
            <div className={styles.searchBar}>
              <CatalogSearchInput />
            </div>

            <div className={styles.resultsToolbar}>
              <CatalogSortSelect />
            </div>

            {view === "infinite" ? (
              <InfiniteProductResults />
            ) : (
              <PaginatedProductResults />
            )}
          </section>
        </div>
      </main>
    </>
  );
}
