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
    <button
      className={styles.cacheButton}
      type="button"
      onClick={resetProductCache}
    >
      Reset Cache
    </button>
  );
}
