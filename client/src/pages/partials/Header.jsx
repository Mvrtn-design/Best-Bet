import { React, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";


function Header() {
  const { authState } = useContext(AuthContext);
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
          {authState.status ? <Link to="/profile">{authState.username}</Link> : <Link to="/login">INICIAR SESIÓN</Link>}
        </div>
      </nav>
    </header>
  );
}

export default Header;
