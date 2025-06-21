import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function NavBar() {
  return (
    <nav className="nav">
      <Link to="/categorias">Minhas Categorias</Link>
    </nav>
  );
}

export default NavBar;