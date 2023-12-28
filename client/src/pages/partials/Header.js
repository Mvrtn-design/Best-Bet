import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <nav className="header">
        <Link to="/" className="header-logo">
          <img src="../pictures/logo_transparent.png" alt="" />
        </Link>
        <Link to="/" className="header-titulo">
          BEST BET
        </Link>
        <div className="header-derecha">
          <Link className="vistoso" to="/">
            INICIO
          </Link>
          <Link to="/clubs">CLUBS</Link>
          <Link to="/login">USUARIO</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
