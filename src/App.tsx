import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProductsPage } from "./pages/ProductsPage";
import { InfiniteProductResults } from "./features/products/components/InfiniteProductResults";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route
          path="/products/infinite-test"
          element={<InfiniteProductResults />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
