import { NetworkSimulationControl } from "../networkSimulation/NetworkSimulationControl";

import type { ResultMode } from "../useResultMode";
import { CacheControl } from "./CacheControl";
import { ProductCacheInspector } from "./ProductCacheInspector";
import { ResultModeControl } from "./ResultModeControl";

import styles from "./DemoWorksite.module.css";

type DemoWorksiteProps = {
  view: ResultMode;
  onViewChange: (view: ResultMode) => void;
};

export function DemoWorksite({ view, onViewChange }: DemoWorksiteProps) {
  return (
    <aside className={styles.demoWorksite} aria-label="Demo worksite">
      <div className={styles.worksiteBody}>
        <section className={styles.optionsPanel}>
          <h3 className={styles.sectionHeading}>Options</h3>

          <div className={styles.optionsControls}>
            <ResultModeControl view={view} onChange={onViewChange} />

            <NetworkSimulationControl />

            <div className={styles.controlGroup}>
              <div className={styles.controlLabel}>Cache</div>

              <CacheControl />
            </div>
          </div>
        </section>

        <section className={styles.cachePanel}>
          <h3 className={styles.sectionHeading}>Cache</h3>

          <ProductCacheInspector />
        </section>
      </div>

      <div className={styles.worksiteTitle}>Demo Worksite</div>
    </aside>
  );
}
