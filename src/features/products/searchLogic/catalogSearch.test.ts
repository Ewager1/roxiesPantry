import { describe, expect, it } from "vitest";

import { normalizeCatalogSearch } from "./catalogSearch";

describe("normalizeCatalogSearch", () => {
  it("trims surrounding whitespace", () => {
    expect(
      normalizeCatalogSearch(
        "  chicken treats  ",
      ),
    ).toBe("chicken treats");
  });

  it("returns an empty string for whitespace", () => {
    expect(
      normalizeCatalogSearch("   "),
    ).toBe("");
  });

  it("returns an empty string for null", () => {
    expect(
      normalizeCatalogSearch(null),
    ).toBe("");
  });
});
