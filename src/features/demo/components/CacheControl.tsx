import { useQueryClient } from "@tanstack/react-query";

import { productKeys } from "../../products/api/productQueryKeys";

import styles from "./DemoWorksite.module.css";

export function CacheControl() {
  const queryClient = useQueryClient();

  function resetProductCache() {
    queryClient.removeQueries({
      queryKey: productKeys.all,
    });
  }

  return (
    <div className={styles.controlGroup}>
      <span className={styles.controlLabel}>Cache</span>

      <div className={styles.toggle}>
        <button
          className={styles.toggleButton}
          type="button"
          onClick={resetProductCache}
        >
          Reset Cache
        </button>
      </div>
    </div>
  );
}
