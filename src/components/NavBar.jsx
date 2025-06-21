import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function NavBar() {
  return (
    <nav className="nav">
      <Link to="/categorias">Minhas Categorias</Link>
      <Link to="/criar-categoria">Criar Categoria</Link>
    </nav>
  );
}

export default NavBar;
