import React from "react";
import Layout from "./partials/Layout";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <Layout>
      <div className="login">
        <h1>Inicio sesion</h1>
        <div c="container">
          <div className="row">
            <div className="col-md-6">
              <div className="section-heading">
                <div className="line-dec">
                  <h2>Iniciar Sesión</h2>
                </div>
                <form role="form" method="post" action="#">
                  <label>Nombre: </label>
                  <lsabel>
                    <input
                      type="text"
                      name="nombreUsuario"
                      placeholder="Nombre de usuario"
                      autocomplete="on"
                      required
                    />
                  </lsabel>

                  <label>Contraseña: </label>
                  <label>
                    <input
                      type="password"
                      name="claveUsuario"
                      placeholder="Introduzca su contraseña"
                      required
                    />
                  </label>

                  <input type="reset" value="Borrar" />
                  <input type="submit" value="Iniciar Sesión" />
                </form>
                <p>
                  Ya tengo una cuenta, <Link to="/setUp">Crear cuenta</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
