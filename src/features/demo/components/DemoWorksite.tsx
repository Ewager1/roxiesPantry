import { NetworkSimulationControl } from "../networkSimulation/NetworkSimulationControl";

import type { ResultMode } from "../useResultMode";
import { CacheControl } from "./CacheControl";
import { ResultModeControl } from "./ResultModeControl";
import { ProductCacheInspector } from "./ProductCacheInspector";

import styles from "./DemoWorksite.module.css";

type DemoWorksiteProps = {
  view: ResultMode;
  onViewChange: (view: ResultMode) => void;
};

export function DemoWorksite({ view, onViewChange }: DemoWorksiteProps) {
  return (
    <aside className={styles.demoWorksite} aria-label="Demo worksite">
      <div className={styles.inner}>
        <div className={styles.heading}>Demo Worksite</div>

        <ResultModeControl view={view} onChange={onViewChange} />

        <NetworkSimulationControl />

        <CacheControl />
      </div>
      <ProductCacheInspector />
    </aside>
  );
}
