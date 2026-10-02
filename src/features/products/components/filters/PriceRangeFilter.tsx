import type { FormEvent } from "react";

import { useCatalogPriceRange } from "../../priceLogic/useCatalogPriceRange";

import styles from "./PriceRangeFilter.module.css";

function parseOptionalPrice(value: FormDataEntryValue | null): number | null {
  const stringValue = String(value ?? "").trim();

  if (!stringValue) {
    return null;
  }

  const parsedValue = Number(stringValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function PriceRangeFilter() {
  const { priceRange, setPriceRange } = useCatalogPriceRange();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setPriceRange({
      min: parseOptionalPrice(formData.get("minPrice")),
      max: parseOptionalPrice(formData.get("maxPrice")),
    });
  }

  const rangeKey = `${priceRange.min ?? ""}-${priceRange.max ?? ""}`;

  return (
    <form key={rangeKey} className={styles.priceRange} onSubmit={handleSubmit}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Price</legend>

        <div className={styles.inputs}>
          <label className={styles.field}>
            <span className={styles.label}>Min</span>

            <div className={styles.inputWrapper}>
              <span className={styles.currencySymbol} aria-hidden="true">
                $
              </span>

              <input
                className={styles.input}
                type="number"
                name="minPrice"
                min="0"
                step="0.01"
                defaultValue={priceRange.min ?? ""}
                placeholder="0"
              />
            </div>
          </label>

          <span className={styles.separator} aria-hidden="true">
            to
          </span>

          <label className={styles.field}>
            <span className={styles.label}>Max</span>

            <div className={styles.inputWrapper}>
              <span className={styles.currencySymbol} aria-hidden="true">
                $
              </span>

              <input
                className={styles.input}
                type="number"
                name="maxPrice"
                min="0"
                step="0.01"
                defaultValue={priceRange.max ?? ""}
                placeholder="Any"
              />
            </div>
          </label>
        </div>

        <button className={styles.button} type="submit">
          Apply
        </button>
      </fieldset>
    </form>
  );
}
