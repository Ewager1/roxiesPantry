import { useDelayedBoolean } from "../../../../hooks/useDelayedBoolean";

import { CatalogStatusBar } from "../CatalogStatusBar";
import { ProductCardSkeleton } from "../ProductCardSkeleton";

import gridStyles from "../ProductGrid.module.css";
import styles from "./CatalogLoadingState.module.css";

const SKELETON_COUNT = 9;

export function CatalogLoadingState() {
  const showSkeletons = useDelayedBoolean(true, 200);

  return (
    <>
      <CatalogStatusBar totalItems={null} isPending />

      <section
        className={`${gridStyles.grid} ${showSkeletons ? "" : styles.hidden}`}
        aria-hidden="true"
      >
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </section>
    </>
  );
}
