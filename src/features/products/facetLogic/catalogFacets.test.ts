import { describe, expect, it } from "vitest";

import {
  getFacetSlugFromParam,
  normalizeFacetSelections,
  pruneFacetSelections,
  removeFacetParams,
  toFacetSelectionInputs,
  writeFacetSelections,
} from "./catalogFacets";

describe("normalizeFacetSelections", () => {
  it("normalizes facet names and option values", () => {
    expect(
      normalizeFacetSelections({
        " flavor ": [" chicken ", "beef", "chicken", ""],
        size: [" large ", "small"],
      }),
    ).toEqual({
      flavor: ["beef", "chicken"],
      size: ["large", "small"],
    });
  });

  it("removes empty facets", () => {
    expect(
      normalizeFacetSelections({
        flavor: ["", "   "],
      }),
    ).toEqual({});
  });
});

describe("getFacetSlugFromParam", () => {
  it("extracts a facet slug", () => {
    expect(
      getFacetSlugFromParam("facet.flavor"),
    ).toBe("flavor");
  });

  it("returns null for non-facet params", () => {
    expect(
      getFacetSlugFromParam("category"),
    ).toBeNull();
  });

  it("returns null for an empty facet slug", () => {
    expect(
      getFacetSlugFromParam("facet."),
    ).toBeNull();
  });
});

describe("writeFacetSelections", () => {
  it("writes repeated facet parameters", () => {
    const params = new URLSearchParams();

    writeFacetSelections(params, {
      flavor: ["chicken", "beef"],
    });

    expect(
      params.getAll("facet.flavor"),
    ).toEqual(["beef", "chicken"]);
  });

  it("preserves unrelated parameters", () => {
    const params = new URLSearchParams({
      category: "food",
    });

    writeFacetSelections(params, {
      flavor: ["chicken"],
    });

    expect(params.get("category")).toBe("food");
    expect(
      params.getAll("facet.flavor"),
    ).toEqual(["chicken"]);
  });

  it("replaces old facet parameters", () => {
    const params = new URLSearchParams();

    params.append("facet.flavor", "beef");
    params.append("facet.size", "large");

    writeFacetSelections(params, {
      flavor: ["chicken"],
    });

    expect(
      params.getAll("facet.flavor"),
    ).toEqual(["chicken"]);

    expect(params.has("facet.size")).toBe(false);
  });
});

describe("removeFacetParams", () => {
  it("removes facet parameters without removing unrelated params", () => {
    const params = new URLSearchParams();

    params.set("category", "food");
    params.append("facet.flavor", "chicken");
    params.append("facet.size", "large");

    removeFacetParams(params);

    expect(params.get("category")).toBe("food");
    expect(params.has("facet.flavor")).toBe(false);
    expect(params.has("facet.size")).toBe(false);
  });
});

describe("pruneFacetSelections", () => {
  it("removes invalid facets and invalid options", () => {
    expect(
      pruneFacetSelections(
        {
          flavor: ["chicken", "beef"],
          size: ["large"],
        },
        [
          {
            slug: "flavor",
            options: [
              {
                slug: "chicken",
              },
            ],
          },
        ],
      ),
    ).toEqual({
      flavor: ["chicken"],
    });
  });

  it("returns an empty object when no selections remain valid", () => {
    expect(
      pruneFacetSelections(
        {
          flavor: ["beef"],
        },
        [
          {
            slug: "flavor",
            options: [
              {
                slug: "chicken",
              },
            ],
          },
        ],
      ),
    ).toEqual({});
  });
});

describe("toFacetSelectionInputs", () => {
  it("converts selections into GraphQL input objects", () => {
    expect(
      toFacetSelectionInputs({
        size: ["small"],
        flavor: ["chicken", "beef"],
      }),
    ).toEqual([
      {
        facet: "flavor",
        options: ["beef", "chicken"],
      },
      {
        facet: "size",
        options: ["small"],
      },
    ]);
  });
});
