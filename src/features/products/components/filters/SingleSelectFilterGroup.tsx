import type { CatalogFilterOption } from "../../api/getCatalogFilterOptions";

import styles from "./FilterGroup.module.css";

type SingleSelectFilterGroupProps = {
  label: string;
  name: string;
  options: CatalogFilterOption[];
  selectedValue: string | null;
  allLabel: string;
  onChange: (value: string | null) => void;
};

export function SingleSelectFilterGroup({
  label,
  name,
  options,
  selectedValue,
  allLabel,
  onChange,
}: SingleSelectFilterGroupProps) {
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{label}</legend>

      <div className={styles.options}>
        <label className={styles.option}>
          <input
            className={styles.input}
            type="radio"
            name={name}
            checked={selectedValue === null}
            onChange={() => onChange(null)}
          />

          <span>{allLabel}</span>
        </label>

        {options.map((option) => (
          <label key={option.id} className={styles.option}>
            <input
              className={styles.input}
              type="radio"
              name={name}
              checked={selectedValue === option.slug}
              onChange={() => onChange(option.slug)}
            />

            <span>{option.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
