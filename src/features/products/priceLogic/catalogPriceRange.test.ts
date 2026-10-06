import { describe, expect, it } from "vitest";

import { normalizeCatalogPriceRange } from "./catalogPriceRange";

describe("normalizeCatalogPriceRange", () => {
  it("parses valid minimum and maximum prices", () => {
    expect(
      normalizeCatalogPriceRange(
        "10",
        "50",
      ),
    ).toEqual({
      min: 10,
      max: 50,
    });
  });

  it("swaps the values when minimum exceeds maximum", () => {
    expect(
      normalizeCatalogPriceRange(
        "50",
        "10",
      ),
    ).toEqual({
      min: 10,
      max: 50,
    });
  });

  it("ignores negative prices", () => {
    expect(
      normalizeCatalogPriceRange(
        "-5",
        "20",
      ),
    ).toEqual({
      min: null,
      max: 20,
    });
  });

  it("ignores non-numeric prices", () => {
    expect(
      normalizeCatalogPriceRange(
        "abc",
        "20",
      ),
    ).toEqual({
      min: null,
      max: 20,
    });
  });

  it("supports an open-ended range", () => {
    expect(
      normalizeCatalogPriceRange(
        "25",
        null,
      ),
    ).toEqual({
      min: 25,
      max: null,
    });
  });
});
