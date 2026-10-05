import type { ProductCacheEntry } from "../cache/productCacheEntries";
import { useProductCacheEntries } from "../cache/useProductCacheEntries";

import styles from "./DemoWorksite.module.css";

type CacheSectionProps = {
  title: string;
  columnLabel: string;
  entries: ProductCacheEntry[];
};

function getPageDisplay(entry: ProductCacheEntry): string {
  if (entry.type === "Paginated") {
    return String(entry.page ?? "—");
  }

  const pageCount = entry.pageCount ?? 0;

  return `${pageCount} ${pageCount === 1 ? "page" : "pages"}`;
}

function CacheSection({ title, columnLabel, entries }: CacheSectionProps) {
  return (
    <section className={styles.cacheSection}>
      <div className={styles.cacheSectionHeader}>
        <h4 className={styles.cacheSectionTitle}>{title}</h4>

        <span className={styles.cacheSectionCount}>
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {entries.length === 0 ? (
        <p className={styles.cacheSectionEmpty}>No cached queries.</p>
      ) : (
        <div className={styles.cacheTable}>
          <div className={styles.cacheTableHeader}>
            <span>{columnLabel}</span>
            <span>Inputs</span>
          </div>

          {entries.map((entry) => (
            <div className={styles.cacheRow} key={entry.id}>
              <span>{getPageDisplay(entry)}</span>

              <div className={styles.cacheInputs}>
                {entry.inputs.map((input) => (
                  <span className={styles.cacheInput} key={input}>
                    {input}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function ProductCacheInspector() {
  const entries = useProductCacheEntries();

  const paginatedEntries = entries.filter(
    (entry) => entry.type === "Paginated",
  );

  const infiniteEntries = entries.filter((entry) => entry.type === "Infinite");

  return (
    <div className={styles.cacheInspector}>
      <div className={styles.cacheColumns}>
        <CacheSection
          title="Paginated Cache"
          columnLabel="Page"
          entries={paginatedEntries}
        />

        <CacheSection
          title="Infinite Cache"
          columnLabel="Pages Cached"
          entries={infiniteEntries}
        />
      </div>
    </div>
  );
}
