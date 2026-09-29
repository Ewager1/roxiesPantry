import { useProducts } from "../features/products/api/useProducts";
import { ProductGrid } from "../features/products/components/ProductGrid";
import styles from "./ProductsPage.module.css";

export function ProductsPage() {
  const { data: products, isPending, isError, error } = useProducts();

  if (isPending) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.subtitle}>Browse Roxie’s Pantry</p>
      </header>

      <ProductGrid products={products} />
    </main>
  );
}
