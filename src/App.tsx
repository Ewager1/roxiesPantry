import { useProducts } from "./features/products/api/useProducts";

function App() {
  const { data: products, isPending, isError, error } = useProducts();

  if (isPending) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <main>
      <h1>Roxie's Pantry</h1>

      {products.map((product) => (
        <article key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.brand.name}</p>
          <p>${product.price}</p>
        </article>
      ))}
    </main>
  );
}

export default App;
