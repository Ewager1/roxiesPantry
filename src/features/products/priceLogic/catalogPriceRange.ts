export type CatalogPriceRange = {
  min: number | null;
  max: number | null;
};

function parsePrice(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export function normalizeCatalogPriceRange(
  minValue: string | null,
  maxValue: string | null,
): CatalogPriceRange {
  const min = parsePrice(minValue);
  const max = parsePrice(maxValue);

  if (min !== null && max !== null && min > max) {
    return {
      min: max,
      max: min,
    };
  }

  return {
    min,
    max,
  };
}
