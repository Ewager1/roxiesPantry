export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  imageUrl: string;
  rating: number | null;
  reviewCount: number;

  pet: {
    id: string;
    name: string;
    slug: string;
  };

  brand: {
    id: string;
    name: string;
    slug: string;
  };

  productType: {
    id: string;
    name: string;
    slug: string;

    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
};
