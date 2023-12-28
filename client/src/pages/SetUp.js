import React from "react";
import Layout from "./partials/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function SetUp() {
  const [form, setForm] = useState({
    nombre: "",
    nombre_usuario: "",
    correo_electronico: "",
    clave: "",
  });
  const navigate = useNavigate();
  function handleSubmit(event) {
    event.preventDefault();

    try {
      fetch("http://localhost:3001/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      console.log("Success");
      navigate("/users");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <Layout>
      <h1>Registrarse</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="section-heading">
              <div className="line-dec"></div>
              <h2>Formulario de registro</h2>

              <form onSubmit={handleSubmit}>
                <label>Nombre: </label>
                <label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    autocomplete="on"
                    value={form.nombre}
                    required
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                  />
                </label>
                Nombre Usuario:
                <input
                  type="text"
                  name="nombre_usuario"
                  placeholder="Ej: nombre_2343"
                  value={form.nombre_usuario}
                  required
                  onChange={(e) =>
                    setForm({ ...form, nombre_usuario: e.target.value })
                  }
                />
                Correo electronico:
                <input
                  type="email"
                  name="correo_electronico"
                  placeholder="Introduzca correo electronico"
                  value={form.correo_electronico}
                  required
                  onChange={(e) =>
                    setForm({ ...form, correo_electronico: e.target.value })
                  }
                />
                Contraseña:
                <input
                  type="password"
                  name="clave"
                  placeholder="Contraseña"
                  required
                  value={form.clave}
                  onChange={(e) => setForm({ ...form, clave: e.target.value })}
                />
                <button type="submit" value="Registrar">
                  Registrar
                </button>
              </form>

              <p>
                Ya tengo un cuenta, <Link to="/logIn">Iniciar Sesion</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SetUp;
