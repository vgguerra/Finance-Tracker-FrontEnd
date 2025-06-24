import React from "react";
import { Routes, Route, RouterProvider } from "react-router-dom";
import App from "../App";
import CategoriesPage from "../pages/CategoriesPage";
import TransactionsPage from "../pages/TransactionsPage";

function Router() {
  return (
    <Routes>
      <Route path="/categorias" element={<CategoriesPage />} />
      <Route path="/" element={<App />} />
      <Route path="/transacoes" element ={<TransactionsPage />} />
    </Routes>
  );
}

export default Router;
