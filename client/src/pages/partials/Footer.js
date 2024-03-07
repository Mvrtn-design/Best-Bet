import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div className="footer">
        <div className="footer-container">
          <div className="row">
            <div className="footer-col">
              <h4>Opciones</h4>
              <ul>
                <li><Link to="/match">Inicio</Link></li>
                <li><Link to="/match">Accesibilidad</Link></li>
                <li><Link to="/match">Ajustes</Link></li>
                <li><Link to="/match">Opciones desarrollador</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>¿Quienes somos?</h4>
              <ul>
                <li><Link to="/match">Empresa</Link></li>
                <li><Link to="/match">Localización</Link></li>
                <li><Link to="/logIn">Sé uno de nosotros</Link></li>
                <li><Link to="/match">Contacto</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Social</h4>
              <div className="social-links">
                <Link to="/match">T</Link>
                <Link to="/match">W</Link>
                <Link to="/match">F</Link>
                <Link to="/match">P</Link>
              </div>
            </div>
          </div>

          <hr></hr>

          <div className="footer-below">
            <div className="footer-copyright">
              <p>
                @{new Date().getFullYear()} BestBet.
              </p>
            </div>
            <div className="footer-below-links">
              <Link to="/match">Términos & condiciones</Link>
              <Link to="/match">Privacidad</Link>
              <Link to="/match">Seguridad</Link>
              <Link to="/match">Declaración de Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
