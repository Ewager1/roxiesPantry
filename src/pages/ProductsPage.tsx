import { DemoWorksite } from "../features/demo/components/DemoWorksite";
import { useResultMode } from "../features/demo/useResultMode";

import { CatalogSearchInput } from "../features/products/components/CatalogSearchInput";
import { CatalogSortSelect } from "../features/products/components/CatalogSortSelect";
import { InfiniteProductResults } from "../features/products/components/InfiniteProductResults";
import { PaginatedProductResults } from "../features/products/components/PaginatedProductResults";
import { ProductFilters } from "../features/products/components/filters/ProductFilters";
import { ShareCatalogButton } from "../features/products/share/components/ShareCatalogButton";
import { CatalogResultsBoundary } from "../features/products/components/resultStates/CatalogResultsBoundary";

import { useCatalogQuery } from "../features/products/useCatalogQuery";

import styles from "./ProductsPage.module.css";

export function ProductsPage() {
  const query = useCatalogQuery();

  const { view, changeView } = useResultMode(query);

  return (
    <>
      <DemoWorksite view={view} onViewChange={changeView} />

      <main className={styles.page}>
        <section className={styles.catalogHeader}>
          <div className={styles.headerTop}>
            <header className={styles.header}>
              <h1 className={styles.title}>Roxie's Pantry</h1>
            </header>

            <ShareCatalogButton />
          </div>

          <div className={styles.searchControls}>
            <div className={styles.searchControl}>
              <CatalogSearchInput />
            </div>

            <div className={styles.sortControl}>
              <CatalogSortSelect />
            </div>
          </div>
        </section>

        <div className={styles.catalogLayout}>
          <ProductFilters />

          <section className={styles.results}>
            <CatalogResultsBoundary>
              {view === "infinite" ? (
                <InfiniteProductResults />
              ) : (
                <PaginatedProductResults />
              )}
            </CatalogResultsBoundary>
          </section>
        </div>
      </main>
    </>
  );
}
