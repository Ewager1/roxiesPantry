import roxiesPantryLogo from "../assets/roxies-pantry-logo.png";

import { DemoWorksite } from "../features/demo/components/DemoWorksite";
import { useResultMode } from "../features/demo/useResultMode";

import { CatalogSearchInput } from "../features/products/components/CatalogSearchInput";
import { CatalogSortSelect } from "../features/products/components/CatalogSortSelect";
import { InfiniteProductResults } from "../features/products/components/InfiniteProductResults";
import { PaginatedProductResults } from "../features/products/components/PaginatedProductResults";
import { ProductFilters } from "../features/products/components/filters/ProductFilters";
import { CatalogResultsBoundary } from "../features/products/components/resultStates/CatalogResultsBoundary";
import { ShareCatalogButton } from "../features/products/share/components/ShareCatalogButton";

import { useCatalogQuery } from "../features/products/useCatalogQuery";

import styles from "./ProductsPage.module.css";

export function ProductsPage() {
  const query = useCatalogQuery();

  const { view, changeView } = useResultMode(query);

  return (
    <>
      <DemoWorksite view={view} onViewChange={changeView} />

      <main className={styles.page}>
        <div className={styles.brandMasthead}>
          <h1 className={styles.brand}>
            <img
              className={styles.logo}
              src={roxiesPantryLogo}
              alt="Roxie's Pantry"
            />
          </h1>
        </div>

        <section className={styles.catalogHeader}>
          <div className={styles.searchControls}>
            <div className={styles.searchControl}>
              <CatalogSearchInput />
            </div>

            <div className={styles.sortControl}>
              <CatalogSortSelect />
            </div>

            <div className={styles.shareControl}>
              <ShareCatalogButton />
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
