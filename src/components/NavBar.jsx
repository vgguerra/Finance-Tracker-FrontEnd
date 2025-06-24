import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function NavBar() {
  return (
    <nav className="nav">
      <Link to="/categorias">Minhas Categorias</Link>
      <Link to="/">Home Page</Link>
      <Link to="/transacoes">Transações</Link>
    </nav>
  );
}

export default NavBar;