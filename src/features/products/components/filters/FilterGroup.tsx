import type { CatalogFilterOption } from "../../api/getCatalogFilterOptions";

import styles from "./FilterGroup.module.css";

type FilterGroupProps = {
  label: string;
  options: CatalogFilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
};

export function FilterGroup({
  label,
  options,
  selectedValues,
  onToggle,
}: FilterGroupProps) {
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{label}</legend>

      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.id} className={styles.option}>
            <input
              className={styles.checkbox}
              type="checkbox"
              checked={selectedValues.includes(option.slug)}
              onChange={() => onToggle(option.slug)}
            />

            <span>{option.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
