import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App";
import CategoriesPage from "../pages/CategoriesPage";

function Router() {
  return (
    <Routes>
      <Route path="/categorias" element={<CategoriesPage />} />
      <Route path="/" element={<App />} />
    </Routes>
  );
}

export default Router;
