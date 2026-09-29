import "dotenv/config";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

faker.seed(42);

const PRODUCT_COUNT = 2_000;

/* -------------------------------------------------------------------------- */
/* Catalog configuration                                                       */
/* -------------------------------------------------------------------------- */

const PETS = [
  {
    name: "Dog",
    slug: "dog",
  },
  {
    name: "Cat",
    slug: "cat",
  },
];

const BRANDS = [
  {
    name: "Roxie's Kitchen",
    slug: "roxies-kitchen",
  },
  {
    name: "Kongo",
    slug: "kongo",
  },
  {
    name: "Wagz",
    slug: "wagz",
  },
  {
    name: "Green Mountain",
    slug: "green-mountain",
  },
  {
    name: "Tugh",
    slug: "tugh",
  },
  {
    name: "Far Fetched",
    slug: "far-fetched",
  },
];

const CATEGORIES = [
  {
    name: "Food",
    slug: "food",
    productTypes: [
      { name: "Dry Food", slug: "dry-food" },
      { name: "Wet Food", slug: "wet-food" },
      { name: "Fresh Food", slug: "fresh-food" },
    ],
  },
  {
    name: "Treats",
    slug: "treats",
    productTypes: [
      { name: "Training Treats", slug: "training-treats" },
      { name: "Dental Treats", slug: "dental-treats" },
      { name: "Chews", slug: "chews" },
    ],
  },
  {
    name: "Toys",
    slug: "toys",
    productTypes: [
      { name: "Rope Toys", slug: "rope-toys" },
      { name: "Plush Toys", slug: "plush-toys" },
      { name: "Fetch Toys", slug: "fetch-toys" },
      { name: "Puzzle Toys", slug: "puzzle-toys" },
    ],
  },
  {
    name: "Grooming",
    slug: "grooming",
    productTypes: [
      { name: "Shampoo", slug: "shampoo" },
      { name: "Brushes", slug: "brushes" },
      { name: "Dental Care", slug: "dental-care" },
    ],
  },
  {
    name: "Beds",
    slug: "beds",
    productTypes: [
      { name: "Bolster Beds", slug: "bolster-beds" },
      { name: "Orthopedic Beds", slug: "orthopedic-beds" },
      { name: "Crate Mats", slug: "crate-mats" },
    ],
  },
];

const FACETS = [
  {
    name: "Lifestage",
    slug: "lifestage",
    options: ["Puppy", "Kitten", "Adult", "Senior"],
  },
  {
    name: "Breed Size",
    slug: "breed-size",
    options: ["Extra Small", "Small", "Medium", "Large", "Giant"],
  },
  {
    name: "Flavor",
    slug: "flavor",
    options: ["Chicken", "Beef", "Salmon", "Turkey", "Lamb", "Duck"],
  },
  {
    name: "Special Diet",
    slug: "special-diet",
    options: [
      "Grain-Free",
      "High Protein",
      "Limited Ingredient",
      "Chicken-Free",
      "Weight Control",
    ],
  },
  {
    name: "Health Feature",
    slug: "health-feature",
    options: [
      "Digestive Health",
      "Skin & Coat",
      "Hip & Joint",
      "Dental Health",
      "Weight Management",
    ],
  },
  {
    name: "Material",
    slug: "material",
    options: [
      "Rope",
      "Rubber",
      "Plush",
      "Nylon",
      "Cotton",
      "Plastic",
      "Memory Foam",
      "Polyester",
    ],
  },
  {
    name: "Durability",
    slug: "durability",
    options: ["Gentle", "Moderate", "Tough", "Extreme"],
  },
  {
    name: "Product Feature",
    slug: "product-feature",
    options: [
      "Squeaky",
      "Interactive",
      "Outdoor",
      "Treat Dispensing",
      "Machine Washable",
      "Sensitive Skin",
      "Odor Control",
      "Hypoallergenic",
      "Deshedding",
      "Detangling",
      "Easy Clean",
      "Non-Slip",
      "Water Resistant",
    ],
  },
];

/*
 * Defines which facet GROUPS are valid for a ProductType.
 *
 * Specific option values are still assigned per Product below.
 */
const PRODUCT_TYPE_FACETS: Record<string, string[]> = {
  "dry-food": [
    "lifestage",
    "breed-size",
    "flavor",
    "special-diet",
    "health-feature",
  ],

  "wet-food": [
    "lifestage",
    "breed-size",
    "flavor",
    "special-diet",
    "health-feature",
  ],

  "fresh-food": [
    "lifestage",
    "breed-size",
    "flavor",
    "special-diet",
    "health-feature",
  ],

  "training-treats": ["lifestage", "breed-size", "flavor", "special-diet"],

  "dental-treats": ["lifestage", "breed-size", "flavor", "health-feature"],

  chews: ["lifestage", "breed-size", "flavor", "durability"],

  "rope-toys": ["breed-size", "material", "durability", "product-feature"],

  "plush-toys": ["breed-size", "material", "durability", "product-feature"],

  "fetch-toys": ["breed-size", "material", "durability", "product-feature"],

  "puzzle-toys": ["breed-size", "material", "product-feature"],

  shampoo: ["lifestage", "health-feature", "product-feature"],

  brushes: ["breed-size", "product-feature"],

  "dental-care": ["lifestage", "health-feature"],

  "bolster-beds": ["breed-size", "material", "product-feature"],

  "orthopedic-beds": ["breed-size", "material", "product-feature"],

  "crate-mats": ["breed-size", "material", "product-feature"],
};

/* -------------------------------------------------------------------------- */
/* Product generation configuration                                            */
/* -------------------------------------------------------------------------- */

const PRICE_RANGES: Record<string, readonly [number, number]> = {
  "dry-food": [20, 90],
  "wet-food": [10, 60],
  "fresh-food": [25, 100],

  "training-treats": [5, 25],
  "dental-treats": [8, 35],
  chews: [5, 30],

  "rope-toys": [7, 25],
  "plush-toys": [6, 30],
  "fetch-toys": [5, 35],
  "puzzle-toys": [10, 50],

  shampoo: [8, 30],
  brushes: [7, 35],
  "dental-care": [5, 25],

  "bolster-beds": [25, 100],
  "orthopedic-beds": [40, 140],
  "crate-mats": [20, 80],
};

const PRODUCT_NAME_PARTS: Record<string, string[]> = {
  "dry-food": [
    "Classic Recipe",
    "Brown Rice Recipe",
    "Homestyle Kibble",
    "Complete Recipe",
  ],

  "wet-food": ["Pâté", "Dinner in Gravy", "Homestyle Stew", "Tender Entrée"],

  "fresh-food": [
    "Fresh Recipe",
    "Farmhouse Meal",
    "Fresh Bowl",
    "Kitchen Recipe",
  ],

  "training-treats": [
    "Training Bites",
    "Reward Bites",
    "Training Minis",
    "Soft Training Treats",
  ],

  "dental-treats": ["Dental Chews", "Fresh Breath Chews", "Dental Bites"],

  chews: ["Long-Lasting Chews", "Tasty Chews", "Classic Chews"],

  "rope-toys": [
    "Braided Tug",
    "Double Knot Rope",
    "Adventure Tug",
    "Heavy Duty Rope",
  ],

  "plush-toys": ["Plush Fox", "Plush Bear", "Plush Squirrel", "Plush Duck"],

  "fetch-toys": [
    "Fetch Ball",
    "Adventure Ball",
    "Bounce Ball",
    "Outdoor Fetch Toy",
  ],

  "puzzle-toys": [
    "Treat Puzzle",
    "Hide & Seek Puzzle",
    "Interactive Puzzle",
    "Challenge Toy",
  ],

  shampoo: [
    "Gentle Coat Shampoo",
    "Fresh Coat Shampoo",
    "Clean Coat Shampoo",
    "Daily Shampoo",
  ],

  brushes: [
    "Slicker Brush",
    "Deshedding Brush",
    "Everyday Grooming Brush",
    "Coat Brush",
  ],

  "dental-care": ["Dental Care Kit", "Fresh Breath Kit", "Dental Cleaning Set"],

  "bolster-beds": ["Cozy Bolster Bed", "Comfort Bolster Bed", "Snuggle Bed"],

  "orthopedic-beds": [
    "Memory Foam Lounger",
    "Orthopedic Rest Bed",
    "Supportive Sleep Bed",
  ],

  "crate-mats": [
    "Comfort Crate Mat",
    "Travel Crate Mat",
    "Cushioned Crate Mat",
  ],
};

const ADJECTIVES = [
  "Classic",
  "Premium",
  "Natural",
  "Coastal",
  "Mountain",
  "Wild",
  "Everyday",
  "Signature",
  "Trail",
  "Homestead",
];

const DESCRIPTION_ENDINGS = [
  "Designed for dependable everyday use.",
  "Made for pets and owners who value simple, practical quality.",
  "A reliable addition to your pet's everyday routine.",
  "Built around comfort, quality, and everyday convenience.",
  "Made with a practical balance of quality and value.",
];

/*
 * Some facets have options that are only sensible for certain ProductTypes.
 * This keeps the generated data believable without complicating the schema.
 */
const MATERIAL_OPTIONS: Record<string, string[]> = {
  "rope-toys": ["Rope", "Cotton", "Nylon"],
  "plush-toys": ["Plush", "Cotton", "Polyester"],
  "fetch-toys": ["Rubber", "Nylon", "Rope"],
  "puzzle-toys": ["Rubber", "Plastic", "Nylon"],

  "bolster-beds": ["Plush", "Cotton", "Polyester"],

  "orthopedic-beds": ["Memory Foam", "Plush", "Polyester"],

  "crate-mats": ["Cotton", "Polyester", "Memory Foam"],
};

const PRODUCT_FEATURE_OPTIONS: Record<string, string[]> = {
  "rope-toys": ["Outdoor", "Interactive"],

  "plush-toys": ["Squeaky", "Interactive"],

  "fetch-toys": ["Outdoor", "Interactive"],

  "puzzle-toys": ["Interactive", "Treat Dispensing"],

  shampoo: ["Sensitive Skin", "Odor Control", "Hypoallergenic"],

  brushes: ["Deshedding", "Detangling", "Easy Clean"],

  "bolster-beds": ["Machine Washable", "Non-Slip"],

  "orthopedic-beds": ["Machine Washable", "Non-Slip"],

  "crate-mats": ["Machine Washable", "Non-Slip", "Water Resistant"],
};

const HEALTH_FEATURE_OPTIONS: Record<string, string[]> = {
  "dry-food": [
    "Digestive Health",
    "Skin & Coat",
    "Hip & Joint",
    "Weight Management",
  ],

  "wet-food": ["Digestive Health", "Skin & Coat", "Weight Management"],

  "fresh-food": ["Digestive Health", "Skin & Coat", "Hip & Joint"],

  "dental-treats": ["Dental Health"],

  shampoo: ["Skin & Coat"],

  "dental-care": ["Dental Health"],
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

type FacetAssignments = Record<string, string[]>;

type ProductDraft = {
  data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    imageUrl: string;
    rating: number | null;
    reviewCount: number;
    petId: string;
    brandId: string;
    productTypeId: string;
  };

  facetAssignments: FacetAssignments;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pickOne<T>(values: readonly T[]): T {
  if (values.length === 0) {
    throw new Error("Cannot select from an empty array.");
  }

  return values[
    faker.number.int({
      min: 0,
      max: values.length - 1,
    })
  ]!;
}

function pickUnique<T>(values: readonly T[], min: number, max: number): T[] {
  if (values.length === 0 || max === 0) {
    return [];
  }

  const count = faker.number.int({
    min: Math.min(min, values.length),
    max: Math.min(max, values.length),
  });

  return faker.helpers.shuffle([...values]).slice(0, count);
}

function chance(percent: number) {
  return (
    faker.number.int({
      min: 1,
      max: 100,
    }) <= percent
  );
}

function randomPrice(min: number, max: number) {
  const raw =
    min +
    faker.number.float({
      min: 0,
      max: max - min,
    });

  return Number(raw.toFixed(2));
}

function randomRating() {
  // Some products intentionally have no reviews yet.
  if (chance(10)) {
    return null;
  }

  const raw = faker.number.float({
    min: 2.5,
    max: 5,
  });

  return Math.round(raw * 10) / 10;
}

function getBreedSizes(petName: string): string[] {
  /*
   * Breed Size is currently meaningful only for dogs.
   *
   * A general-purpose product receives several compatible sizes rather
   * than a magic "All Breeds" value. This keeps filtering generic:
   * filtering Large simply looks for products assigned Large.
   */
  if (petName !== "Dog") {
    return [];
  }

  const roll = faker.number.int({
    min: 1,
    max: 100,
  });

  if (roll <= 20) {
    return ["Extra Small", "Small", "Medium", "Large", "Giant"];
  }

  if (roll <= 35) {
    return ["Extra Small", "Small"];
  }

  if (roll <= 55) {
    return ["Small", "Medium"];
  }

  if (roll <= 80) {
    return ["Medium", "Large"];
  }

  if (roll <= 95) {
    return ["Large", "Giant"];
  }

  return [pickOne(["Extra Small", "Small", "Medium", "Large", "Giant"])];
}

function getLifestages(petName: string): string[] {
  const stages =
    petName === "Cat"
      ? ["Kitten", "Adult", "Senior"]
      : ["Puppy", "Adult", "Senior"];

  const roll = faker.number.int({
    min: 1,
    max: 100,
  });

  // General-purpose / all-life-stage product.
  if (roll <= 15) {
    return stages;
  }

  if (roll <= 50) {
    return ["Adult"];
  }

  if (roll <= 65) {
    return [stages[0]!];
  }

  if (roll <= 80) {
    return ["Senior"];
  }

  return pickUnique(stages, 2, 2);
}

function buildFacetAssignments(
  productTypeSlug: string,
  petName: string,
): FacetAssignments {
  const applicableFacets = PRODUCT_TYPE_FACETS[productTypeSlug] ?? [];

  const applicable = new Set(applicableFacets);

  const assignments: FacetAssignments = {};

  if (applicable.has("lifestage")) {
    assignments.lifestage = getLifestages(petName);
  }

  if (applicable.has("breed-size")) {
    const sizes = getBreedSizes(petName);

    if (sizes.length > 0) {
      assignments["breed-size"] = sizes;
    }
  }

  if (applicable.has("flavor")) {
    assignments.flavor = [
      pickOne(["Chicken", "Beef", "Salmon", "Turkey", "Lamb", "Duck"]),
    ];
  }

  if (applicable.has("special-diet")) {
    const flavor = assignments.flavor?.[0];

    const possibleDiets = [
      "Grain-Free",
      "High Protein",
      "Limited Ingredient",
      "Chicken-Free",
      "Weight Control",
    ].filter((diet) => !(diet === "Chicken-Free" && flavor === "Chicken"));

    if (!chance(30)) {
      assignments["special-diet"] = pickUnique(
        possibleDiets,
        1,
        chance(25) ? 2 : 1,
      );
    }
  }

  if (applicable.has("health-feature")) {
    const possibleHealthFeatures = HEALTH_FEATURE_OPTIONS[productTypeSlug] ?? [
      "Digestive Health",
      "Skin & Coat",
      "Hip & Joint",
      "Dental Health",
      "Weight Management",
    ];

    if (!chance(35)) {
      assignments["health-feature"] = pickUnique(
        possibleHealthFeatures,
        1,
        chance(20) ? 2 : 1,
      );
    }
  }

  if (applicable.has("material")) {
    const possibleMaterials = MATERIAL_OPTIONS[productTypeSlug] ?? [
      "Rope",
      "Rubber",
      "Plush",
      "Nylon",
      "Cotton",
      "Plastic",
      "Memory Foam",
      "Polyester",
    ];

    assignments.material = [pickOne(possibleMaterials)];
  }

  if (applicable.has("durability")) {
    assignments.durability = [
      pickOne(["Gentle", "Moderate", "Tough", "Extreme"]),
    ];
  }

  if (applicable.has("product-feature")) {
    const possibleFeatures = PRODUCT_FEATURE_OPTIONS[productTypeSlug] ?? [];

    if (possibleFeatures.length > 0) {
      assignments["product-feature"] = pickUnique(
        possibleFeatures,
        1,
        Math.min(3, possibleFeatures.length),
      );
    }
  }

  return assignments;
}

function buildProductName(
  productTypeSlug: string,
  facetAssignments: FacetAssignments,
) {
  const adjective = pickOne(ADJECTIVES);

  const options = PRODUCT_NAME_PARTS[productTypeSlug];

  if (!options) {
    return `${adjective} Pet Product`;
  }

  let baseName = pickOne(options);

  /*
   * For foods and treats, using the generated Flavor in the product name
   * keeps visible product data consistent with its filtering metadata.
   */
  const flavor = facetAssignments.flavor?.[0];

  if (flavor) {
    baseName = `${flavor} ${baseName}`;
  }

  return `${adjective} ${baseName}`;
}

function buildDescription(
  brandName: string,
  productTypeName: string,
  petName: string,
) {
  const pluralPet = petName === "Cat" ? "cats" : "dogs";

  return `${brandName} ${productTypeName.toLowerCase()} designed for ${pluralPet}. ${pickOne(
    DESCRIPTION_ENDINGS,
  )}`;
}

/* -------------------------------------------------------------------------- */
/* Seed phases                                                                 */
/* -------------------------------------------------------------------------- */

async function clearDatabase() {
  console.log("Clearing existing catalog data...");

  await prisma.$transaction([
    prisma.productFacetOption.deleteMany(),
    prisma.product.deleteMany(),
    prisma.productTypeFacet.deleteMany(),
    prisma.facetOption.deleteMany(),
    prisma.facet.deleteMany(),
    prisma.productType.deleteMany(),
    prisma.category.deleteMany(),
    prisma.brand.deleteMany(),
    prisma.pet.deleteMany(),
  ]);
}

async function seedCatalogStructure() {
  console.log("Seeding catalog structure...");

  await prisma.pet.createMany({
    data: PETS,
  });

  await prisma.brand.createMany({
    data: BRANDS,
  });

  await prisma.category.createMany({
    data: CATEGORIES.map(({ name, slug }) => ({
      name,
      slug,
    })),
  });

  const categories = await prisma.category.findMany();

  const categoryBySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );

  const productTypeRows = CATEGORIES.flatMap((category) => {
    const databaseCategory = categoryBySlug.get(category.slug);

    if (!databaseCategory) {
      throw new Error(`Missing category ${category.slug}`);
    }

    return category.productTypes.map((productType) => ({
      name: productType.name,
      slug: productType.slug,
      categoryId: databaseCategory.id,
    }));
  });

  await prisma.productType.createMany({
    data: productTypeRows,
  });

  await prisma.facet.createMany({
    data: FACETS.map(({ name, slug }) => ({
      name,
      slug,
    })),
  });

  const facets = await prisma.facet.findMany();

  const facetBySlug = new Map(facets.map((facet) => [facet.slug, facet]));

  const facetOptionRows = FACETS.flatMap((facet) => {
    const databaseFacet = facetBySlug.get(facet.slug);

    if (!databaseFacet) {
      throw new Error(`Missing facet ${facet.slug}`);
    }

    return facet.options.map((option) => ({
      name: option,
      slug: slugify(option),
      facetId: databaseFacet.id,
    }));
  });

  await prisma.facetOption.createMany({
    data: facetOptionRows,
  });

  const productTypes = await prisma.productType.findMany();

  const productTypeBySlug = new Map(
    productTypes.map((productType) => [productType.slug, productType]),
  );

  const productTypeFacetRows = Object.entries(PRODUCT_TYPE_FACETS).flatMap(
    ([productTypeSlug, facetSlugs]) => {
      const productType = productTypeBySlug.get(productTypeSlug);

      if (!productType) {
        throw new Error(`Missing ProductType ${productTypeSlug}`);
      }

      return facetSlugs.map((facetSlug) => {
        const facet = facetBySlug.get(facetSlug);

        if (!facet) {
          throw new Error(`Missing Facet ${facetSlug}`);
        }

        return {
          productTypeId: productType.id,
          facetId: facet.id,
        };
      });
    },
  );

  await prisma.productTypeFacet.createMany({
    data: productTypeFacetRows,
  });
}

async function generateProducts() {
  console.log(`Generating ${PRODUCT_COUNT} products...`);

  const [pets, brands, productTypes, facetOptions] = await Promise.all([
    prisma.pet.findMany({
      orderBy: {
        slug: "asc",
      },
    }),

    prisma.brand.findMany({
      orderBy: {
        slug: "asc",
      },
    }),

    prisma.productType.findMany({
      orderBy: {
        slug: "asc",
      },
    }),

    prisma.facetOption.findMany({
      include: {
        facet: true,
      },
    }),
  ]);

  /*
   * Make every Pet × Brand × ProductType combination appear repeatedly.
   *
   * 2 pets × 6 brands × 16 product types = 192 base combinations.
   * At 2,000 products, each combination appears about 10-11 times.
   */
  const combinations = faker.helpers.shuffle(
    pets.flatMap((pet) =>
      brands.flatMap((brand) =>
        productTypes.map((productType) => ({
          pet,
          brand,
          productType,
        })),
      ),
    ),
  );

  const drafts: ProductDraft[] = [];

  for (let index = 0; index < PRODUCT_COUNT; index += 1) {
    const combination = combinations[index % combinations.length]!;

    const { pet, brand, productType } = combination;

    const facetAssignments = buildFacetAssignments(productType.slug, pet.name);

    const name = buildProductName(productType.slug, facetAssignments);

    const priceRange = PRICE_RANGES[productType.slug] ?? [5, 100];

    const rating = randomRating();

    const productSlug = `${slugify(name)}-${brand.slug}-${productType.slug}-${
      index + 1
    }`;

    drafts.push({
      data: {
        name,
        slug: productSlug,

        description: buildDescription(brand.name, productType.name, pet.name),

        price: randomPrice(priceRange[0], priceRange[1]),

        imageUrl: `/products/generated/${brand.slug}-${productType.slug}.svg`,

        rating,

        reviewCount:
          rating === null
            ? 0
            : faker.number.int({
                min: 1,
                max: 3_000,
              }),

        petId: pet.id,
        brandId: brand.id,
        productTypeId: productType.id,
      },

      facetAssignments,
    });
  }

  await prisma.product.createMany({
    data: drafts.map((draft) => draft.data),
  });

  console.log("Products created. Assigning facet options...");

  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
    },
  });

  const productIdBySlug = new Map(
    products.map((product) => [product.slug, product.id]),
  );

  /*
   * A FacetOption slug is only unique inside its Facet, so the map key
   * includes both facet slug and option slug.
   */
  const facetOptionIdByKey = new Map(
    facetOptions.map((option) => [
      `${option.facet.slug}:${option.slug}`,
      option.id,
    ]),
  );

  const productFacetOptionRows: Array<{
    productId: string;
    facetOptionId: string;
  }> = [];

  for (const draft of drafts) {
    const productId = productIdBySlug.get(draft.data.slug);

    if (!productId) {
      throw new Error(`Missing generated product ${draft.data.slug}`);
    }

    for (const [facetSlug, optionNames] of Object.entries(
      draft.facetAssignments,
    )) {
      for (const optionName of optionNames) {
        const optionSlug = slugify(optionName);

        const optionId = facetOptionIdByKey.get(`${facetSlug}:${optionSlug}`);

        if (!optionId) {
          throw new Error(`Missing facet option ${facetSlug}:${optionSlug}`);
        }

        productFacetOptionRows.push({
          productId,
          facetOptionId: optionId,
        });
      }
    }
  }

  await prisma.productFacetOption.createMany({
    data: productFacetOptionRows,
    skipDuplicates: true,
  });
}

async function printSeedSummary() {
  const [
    petCount,
    brandCount,
    categoryCount,
    productTypeCount,
    facetCount,
    facetOptionCount,
    productCount,
    facetAssignmentCount,
  ] = await Promise.all([
    prisma.pet.count(),
    prisma.brand.count(),
    prisma.category.count(),
    prisma.productType.count(),
    prisma.facet.count(),
    prisma.facetOption.count(),
    prisma.product.count(),
    prisma.productFacetOption.count(),
  ]);

  console.log(`
Seed complete.

Pets:                 ${petCount}
Brands:               ${brandCount}
Categories:           ${categoryCount}
Product Types:        ${productTypeCount}
Facets:               ${facetCount}
Facet Options:        ${facetOptionCount}
Products:             ${productCount}
Facet Assignments:    ${facetAssignmentCount}
`);
}

/* -------------------------------------------------------------------------- */
/* Main                                                                        */
/* -------------------------------------------------------------------------- */

async function main() {
  await clearDatabase();
  await seedCatalogStructure();
  await generateProducts();
  await printSeedSummary();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);

    await prisma.$disconnect();

    process.exit(1);
  });
