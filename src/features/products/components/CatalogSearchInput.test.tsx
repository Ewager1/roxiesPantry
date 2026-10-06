import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import { describe, expect, it } from "vitest";

import { CatalogSearchInput } from "./CatalogSearchInput";

function LocationProbe() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  return (
    <div>
      <span data-testid="search-param">{params.get("search") ?? ""}</span>
      <span data-testid="brand-param">{params.get("brand") ?? ""}</span>
      <span data-testid="page-param">{params.get("page") ?? ""}</span>
    </div>
  );
}

describe("CatalogSearchInput", () => {
  it("writes the submitted search to the URL and resets pagination", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/products?brand=kongo&page=3"]}>
        <CatalogSearchInput />
        <LocationProbe />
      </MemoryRouter>,
    );

    const input = screen.getByRole("searchbox", {
      name: "Search products",
    });

    await user.type(input, "chicken treats");

    await user.click(
      screen.getByRole("button", {
        name: "Search",
      }),
    );

    expect(screen.getByTestId("search-param")).toHaveTextContent(
      "chicken treats",
    );

    expect(screen.getByTestId("brand-param")).toHaveTextContent("kongo");

    expect(screen.getByTestId("page-param")).toHaveTextContent("");
  });

  it("removes the search parameter when an active search is cleared", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={["/products?search=chicken&brand=kongo"]}
      >
        <CatalogSearchInput />
        <LocationProbe />
      </MemoryRouter>,
    );

    const input = screen.getByRole("searchbox", {
      name: "Search products",
    });

    await user.clear(input);

    expect(screen.getByTestId("search-param")).toHaveTextContent("");

    expect(screen.getByTestId("brand-param")).toHaveTextContent("kongo");
  });
});
