import type { FormEvent } from "react";

import { useCatalogSearch } from "../searchLogic/useCatalogSearch";

import styles from "./CatalogSearchInput.module.css";

export function CatalogSearchInput() {
  const { search, setSearch } = useCatalogSearch();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const nextSearch = String(formData.get("search") ?? "");

    setSearch(nextSearch);
  }

  return (
    <form
      key={search}
      className={styles.search}
      onSubmit={handleSubmit}
      role="search"
    >
      <label className={styles.label} htmlFor="catalog-search">
        Search products
      </label>

      <div className={styles.controls}>
        <input
          id="catalog-search"
          className={styles.input}
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search products"
          onChange={(event) => {
            if (search && event.currentTarget.value.trim() === "") {
              setSearch("");
            }
          }}
        />

        <button className={styles.button} type="submit">
          Search
        </button>
      </div>
    </form>
  );
}
