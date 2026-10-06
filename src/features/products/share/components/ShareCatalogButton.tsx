import { useShareCatalog } from "../useShareCatalog";

import styles from "./shareCatalogButton.module.css";

export function ShareCatalogButton() {
  const { shareCatalog, status } = useShareCatalog();

  const label = (() => {
    switch (status) {
      case "shared":
        return "Shared";

      case "copied":
        return "Link copied";

      case "error":
        return "Couldn't share";

      default:
        return "Share this list";
    }
  })();

  return (
    <button className={styles.button} type="button" onClick={shareCatalog}>
      {label}
    </button>
  );
}
