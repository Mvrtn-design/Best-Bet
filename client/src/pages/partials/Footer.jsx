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
                <li><Link to="/faq">Dudas Comunes</Link></li>
                <li><Link to="/login">Opciones desarrollador</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>¿Quienes somos?</h4>
              <ul>
                <li><Link to="/contact">Contacto</Link></li>
                <li><Link to="/about">Acerca de</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Social</h4>
              <div className="social-links">
                <Link to="https://github.com/Mvrtn-design">G</Link>
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
              <Link to="/terms-and-conditions">Términos & condiciones</Link>
              <Link to="/privacy">Privacidad</Link>
              <Link to="/cookies">Declaración de Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
