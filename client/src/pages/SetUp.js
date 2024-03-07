import React from "react";
import App from "../App";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";


function SetUp() {
  const setUpSchema = Yup.object().shape({
    nombre_usuario: Yup.string().min(3).max(15).required()
      .required('El nombre de usuario es obligatorio [Minimo 3 caracteres y maximo 15]'),
    clave: Yup.string()
      .min(4, 'La contraseña debe tener al menos 4 caracteres')
      .required('La contraseña es obligatoria'),
  });

  const handleSave = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("http://localhost:3001/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      setSubmitting(false); // Set submitting to false when the request is successful
    } catch (error) {
      console.error("Error: ", error);
      setSubmitting(false); // Set submitting to false in case of an error
    }
  };

  return (
    <App>
      <h1>Registrarse</h1>
      <div className="container">
        <h2>Formulario de registro</h2>
        <Formik initialValues={{ nombre: "", nombre_usuario: "", correo_electronico: "", clave: "" }} validationSchema={setUpSchema} onSubmit={handleSave}>
          {({ isSubmitting }) => (
            <Form>
              <label>
                Nombre:
                <Field type="text"
                  name="nombre"
                  placeholder="Nombre"
                  autocomplete="on"
                  required />
              </label>
              <label>
                Nombre Usuario:
                <Field type="text"
                  name="nombre_usuario"
                  placeholder="Ej: nombre_2343"
                  required />
              </label>
              <label>
                Correo electronico:
                <Field type="email"
                  name="correo_electronico"
                  placeholder="Introduzca correo electronico"
                  required />
              </label>
              <label>
                Contraseña: <Field type="password" name="clave" autoComplete="off" placeholder="Contraseña" required />
              </label>
              <button type="submit" disabled={isSubmitting}>
                REGISTRAR
              </button>
            </Form>
          )}
        </Formik>
        <p>
          Ya tengo un cuenta, <Link to="/logIn">Iniciar Sesion</Link>
        </p>
      </div>
    </App >
  );
}

export default SetUp;
