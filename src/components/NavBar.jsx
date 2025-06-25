import React from "react";
import { Link } from "react-router-dom";
import { ContainerNav } from "../styles/NavBarStyles";

function NavBar() {
  return (
    <ContainerNav>
      <Link to="/categorias">Minhas Categorias</Link>
      <Link to="/">Home Page</Link>
      <Link to="/transacoes">Transações</Link>
    </ContainerNav>
  );
}

export default NavBar;