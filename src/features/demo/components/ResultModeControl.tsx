import type { ResultMode } from "../useResultMode";

import styles from "./DemoWorksite.module.css";

type ResultModeControlProps = {
  view: ResultMode;
  onChange: (view: ResultMode) => void;
};

export function ResultModeControl({ view, onChange }: ResultModeControlProps) {
  return (
    <div className={styles.controlGroup}>
      <span className={styles.controlLabel}>Result Mode</span>

      <div className={styles.toggle}>
        <button
          className={styles.toggleButton}
          type="button"
          disabled={view === "pagination"}
          onClick={() => onChange("pagination")}
        >
          Paginated
        </button>

        <button
          className={styles.toggleButton}
          type="button"
          disabled={view === "infinite"}
          onClick={() => onChange("infinite")}
        >
          Infinite
        </button>
      </div>
    </div>
  );
}
