import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProductsPage } from "./pages/ProductsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
