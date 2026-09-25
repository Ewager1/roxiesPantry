import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const dogFood = await prisma.category.upsert({
    where: { slug: "dog-food" },
    update: {},
    create: {
      name: "Dog Food",
      slug: "dog-food",
    },
  });

  const dogToys = await prisma.category.upsert({
    where: { slug: "dog-toys" },
    update: {},
    create: {
      name: "Dog Toys",
      slug: "dog-toys",
    },
  });

  const roxiesKitchen = await prisma.brand.upsert({
    where: { name: "Roxie's Kitchen" },
    update: {},
    create: {
      name: "Roxie's Kitchen",
    },
  });

  const trailPup = await prisma.brand.upsert({
    where: { name: "Trail Pup" },
    update: {},
    create: {
      name: "Trail Pup",
    },
  });

  await prisma.product.upsert({
    where: { slug: "chicken-brown-rice-dog-food" },
    update: {},
    create: {
      name: "Chicken & Brown Rice Dog Food",
      slug: "chicken-brown-rice-dog-food",
      description: "Chicken-forward dry dog food with brown rice.",
      price: 42.99,
      imageUrl: "https://placehold.co/600x600",
      rating: 4.7,
      reviewCount: 184,
      brandId: roxiesKitchen.id,
      categoryId: dogFood.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "mountain-rope-tug" },
    update: {},
    create: {
      name: "Mountain Rope Tug",
      slug: "mountain-rope-tug",
      description: "Durable rope tug toy for active dogs.",
      price: 14.99,
      imageUrl: "https://placehold.co/600x600",
      rating: 4.5,
      reviewCount: 67,
      brandId: trailPup.id,
      categoryId: dogToys.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
