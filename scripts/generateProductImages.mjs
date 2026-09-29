import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUTPUT_DIR = join(process.cwd(), "public", "products", "generated");

const BRANDS = [
  {
    name: "Roxie's Kitchen",
    slug: "roxies-kitchen",
    background: "#2563eb",
    accent: "#bfdbfe",
    foreground: "#ffffff",
  },
  {
    name: "Kongo",
    slug: "kongo",
    background: "#d97706",
    accent: "#fde68a",
    foreground: "#ffffff",
  },
  {
    name: "Wagz",
    slug: "wagz",
    background: "#7c3aed",
    accent: "#ddd6fe",
    foreground: "#ffffff",
  },
  {
    name: "Green Mountain",
    slug: "green-mountain",
    background: "#287052",
    accent: "#bbf7d0",
    foreground: "#ffffff",
  },
  {
    name: "Tugh",
    slug: "tugh",
    background: "#c2410c",
    accent: "#fed7aa",
    foreground: "#ffffff",
  },
  {
    name: "Far Fetched",
    slug: "far-fetched",
    background: "#0369a1",
    accent: "#bae6fd",
    foreground: "#ffffff",
  },
];

const PRODUCT_TYPES = [
  {
    name: "Dry Food",
    slug: "dry-food",
    icon: "package",
  },
  {
    name: "Wet Food",
    slug: "wet-food",
    icon: "bowl",
  },
  {
    name: "Fresh Food",
    slug: "fresh-food",
    icon: "bowl-spoon",
  },

  {
    name: "Training Treats",
    slug: "training-treats",
    icon: "bone",
  },
  {
    name: "Dental Treats",
    slug: "dental-treats",
    icon: "dental",
  },
  {
    name: "Chews",
    slug: "chews",
    icon: "bone",
  },

  {
    name: "Rope Toys",
    slug: "rope-toys",
    icon: "hand-grab",
  },
  {
    name: "Plush Toys",
    slug: "plush-toys",
    icon: "paw",
  },
  {
    name: "Fetch Toys",
    slug: "fetch-toys",
    icon: "ball-tennis",
  },
  {
    name: "Puzzle Toys",
    slug: "puzzle-toys",
    icon: "puzzle",
  },

  {
    name: "Shampoo",
    slug: "shampoo",
    icon: "bottle",
  },
  {
    name: "Brushes",
    slug: "brushes",
    icon: "brush",
  },
  {
    name: "Dental Care",
    slug: "dental-care",
    icon: "dental",
  },

  {
    name: "Bolster Beds",
    slug: "bolster-beds",
    icon: "bed",
  },
  {
    name: "Orthopedic Beds",
    slug: "orthopedic-beds",
    icon: "bed",
  },
  {
    name: "Crate Mats",
    slug: "crate-mats",
    icon: "rectangle",
  },
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function readTablerIcon(iconName) {
  const iconPath = join(
    process.cwd(),
    "node_modules",
    "@tabler",
    "icons",
    "icons",
    "outline",
    `${iconName}.svg`,
  );

  const svg = await readFile(iconPath, "utf8");

  return svg
    .replace(/<svg[^>]*>/, "")
    .replace("</svg>", "")
    .replaceAll("currentColor", "#ffffff");
}

async function getIcon(productType) {
  try {
    return await readTablerIcon(productType.icon);
  } catch {
    console.warn(
      `Missing Tabler icon "${productType.icon}" for "${productType.name}". Using package icon.`,
    );

    return readTablerIcon("package");
  }
}

async function createProductSvg(brand, productType) {
  const icon = await getIcon(productType);

  const brandName = escapeXml(brand.name);
  const productTypeName = escapeXml(productType.name);

  return `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 600 600"
  width="600"
  height="600"
>
  <rect
    width="600"
    height="600"
    rx="36"
    fill="${brand.background}"
  />

  <!-- Decorative background -->
  <circle
    cx="510"
    cy="80"
    r="165"
    fill="${brand.accent}"
    opacity="0.18"
  />

  <circle
    cx="70"
    cy="555"
    r="190"
    fill="${brand.accent}"
    opacity="0.12"
  />

  <!-- Brand label -->
  <text
    x="300"
    y="58"
    text-anchor="middle"
    fill="${brand.accent}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="15"
    font-weight="700"
    letter-spacing="4"
  >
    BRAND
  </text>

  <!-- Brand name -->
  <text
    x="300"
    y="118"
    text-anchor="middle"
    fill="${brand.foreground}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="48"
    font-weight="700"
  >
    ${brandName}
  </text>

  <!-- Product icon -->
  <g
    transform="translate(180 165) scale(10)"
    fill="none"
    stroke="${brand.foreground}"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    ${icon}
  </g>

  <!-- Product type label -->
  <text
    x="300"
    y="448"
    text-anchor="middle"
    fill="${brand.accent}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="15"
    font-weight="700"
    letter-spacing="4"
  >
    PRODUCT TYPE
  </text>

  <!-- Product type -->
  <text
    x="300"
    y="505"
    text-anchor="middle"
    fill="${brand.foreground}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="42"
    font-weight="700"
  >
    ${productTypeName}
  </text>
</svg>
`.trim();
}

async function main() {
  await mkdir(OUTPUT_DIR, {
    recursive: true,
  });

  let generatedCount = 0;

  for (const brand of BRANDS) {
    for (const productType of PRODUCT_TYPES) {
      const filename = `${brand.slug}-${productType.slug}.svg`;

      const filepath = join(OUTPUT_DIR, filename);

      const svg = await createProductSvg(brand, productType);

      await writeFile(filepath, svg, "utf8");

      generatedCount += 1;
    }
  }

  console.log(`Generated ${generatedCount} product images in ${OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error("Failed to generate product images:");
  console.error(error);

  process.exit(1);
});
