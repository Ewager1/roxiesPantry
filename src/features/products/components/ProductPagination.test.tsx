import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import { describe, expect, it } from "vitest";

import type { PaginationInfo } from "../types";

import { ProductPagination } from "./ProductPagination";

const pagination: PaginationInfo = {
  page: 2,
  pageSize: 25,
  totalItems: 125,
  totalPages: 5,
  hasNextPage: true,
  hasPreviousPage: true,
};

function LocationProbe() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  return (
    <div>
      <span data-testid="page-param">{params.get("page") ?? ""}</span>
      <span data-testid="pet-param">{params.get("pet") ?? ""}</span>
      <span data-testid="sort-param">{params.get("sort") ?? ""}</span>
    </div>
  );
}

describe("ProductPagination", () => {
  it("moves to the next page while preserving other catalog state", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={["/products?pet=dog&sort=rating&page=2"]}
      >
        <ProductPagination pagination={pagination} />
        <LocationProbe />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    expect(screen.getByTestId("page-param")).toHaveTextContent("3");

    expect(screen.getByTestId("pet-param")).toHaveTextContent("dog");

    expect(screen.getByTestId("sort-param")).toHaveTextContent("rating");
  });

  it("removes the page parameter when returning to page one", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/products?pet=dog&page=2"]}>
        <ProductPagination pagination={pagination} />
        <LocationProbe />
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "1",
      }),
    );

    expect(screen.getByTestId("page-param")).toHaveTextContent("");

    expect(screen.getByTestId("pet-param")).toHaveTextContent("dog");
  });
});
