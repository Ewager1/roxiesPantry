import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import { describe, expect, it } from "vitest";

import { CatalogSortSelect } from "./CatalogSortSelect";

function LocationProbe() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  return (
    <div>
      <span data-testid="sort-param">{params.get("sort") ?? ""}</span>
      <span data-testid="pet-param">{params.get("pet") ?? ""}</span>
      <span data-testid="page-param">{params.get("page") ?? ""}</span>
    </div>
  );
}

describe("CatalogSortSelect", () => {
  it("writes the selected sort to the URL, preserves filters, and resets page", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/products?pet=dog&page=4"]}>
        <CatalogSortSelect />
        <LocationProbe />
      </MemoryRouter>,
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Sort by",
      }),
      "price-low-to-high",
    );

    expect(screen.getByTestId("sort-param")).toHaveTextContent(
      "price-low-to-high",
    );

    expect(screen.getByTestId("pet-param")).toHaveTextContent("dog");

    expect(screen.getByTestId("page-param")).toHaveTextContent("");
  });

  it("removes the sort parameter when returning to the default sort", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/products?sort=rating"]}>
        <CatalogSortSelect />
        <LocationProbe />
      </MemoryRouter>,
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Sort by",
      }),
      "name-ascending",
    );

    expect(screen.getByTestId("sort-param")).toHaveTextContent("");
  });
});
