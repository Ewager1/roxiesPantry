import { describe, expect, it } from "vitest";

import {
  normalizeFilterValues,
  normalizeSingleFilterValue,
} from "./catalogFilters";

describe("normalizeFilterValues", () => {
  it("trims, removes empty values, removes duplicates, and sorts", () => {
    expect(
      normalizeFilterValues([
        "kongo",
        " roxies-kitchen ",
        "",
        "kongo",
        "   ",
      ]),
    ).toEqual([
      "kongo",
      "roxies-kitchen",
    ]);
  });

  it("returns an empty array when no valid values exist", () => {
    expect(
      normalizeFilterValues([
        "",
        "   ",
      ]),
    ).toEqual([]);
  });
});

describe("normalizeSingleFilterValue", () => {
  it("trims a valid value", () => {
    expect(
      normalizeSingleFilterValue(" toys "),
    ).toBe("toys");
  });

  it("returns null for an empty value", () => {
    expect(
      normalizeSingleFilterValue("   "),
    ).toBeNull();
  });

  it("returns null when the value is null", () => {
    expect(
      normalizeSingleFilterValue(null),
    ).toBeNull();
  });
});
