export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  imageUrl: string;
  rating: number | null;
  reviewCount: number;
  brand: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
};
