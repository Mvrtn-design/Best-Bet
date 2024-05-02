import { React, useContext } from "react";
import Layout from "./partials/Layout";
import { Link, useNavigate } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import * as Yup from 'yup';
import { AuthContext } from "../helpers/AuthContext";
import getAPI_URL from "../helpers/api_url";

// Define the Yup validation schema
const loginSchema = Yup.object().shape({
  nombre_usuario: Yup.string()
    .required('El nombre de usuario es obligatorio'),
  clave: Yup.string()
    .min(4, 'La contraseña debe tener al menos 4 caracteres')
    .required('La contraseña es obligatoria'),
});

export default function Login() {
  let navigate = useNavigate();
  const { authState, setAuthState } = useContext(AuthContext);

  const handleSearch = async (valuess) => {
    try {
      const teamsResponse = await axios.get(`${getAPI_URL}/check`, {
        params: {
          value: valuess,
        },
      });
      if (!teamsResponse.data.error) {
        setAuthState({ ...authState, status: true, username: teamsResponse.data.username, id: teamsResponse.data.id });
        localStorage.setItem("tokenAcceso", teamsResponse.data.token);
        navigate("/");
      } else {
        console.warn(teamsResponse.data.error);
        alert(teamsResponse.data.error);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <Layout>
      <div className="user-container">
        <div className="user-form">
          <p className="heading">INICIO SESIÓN</p>
          <p className="paragraph">Introduzca sus credenciales</p>
          <Formik
            initialValues={{ nombre_usuario: "", clave: "" }}
            validationSchema={loginSchema}
            onSubmit={handleSearch}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="input-group">
                  <label >
                    Nombre:
                    <Field
                      type="text"
                      name="nombre_usuario"
                      placeholder="Nombre de usuario"
                      autoComplete="on"
                      required
                    />
                    {errors.nombre_usuario && touched.nombre_usuario && (
                      <div className="error">{errors.nombre_usuario}</div>
                    )}
                  </label>
                </div>
                <div className="input-group">
                  <label >
                    Clave: <Field type="password" name="clave" autoComplete="off" placeholder="Introduzca su contraseña" required />
                    {errors.clave && touched.clave && (
                      <div className="error">{errors.clave}</div>
                    )}
                  </label>
                </div>
                <button className="button-important" type="submit">
                  BUSCAR
                </button>
                <button className="button-important" type="reset" >
                  BORRAR
                </button>
              </Form>
            )}
          </Formik>
          <div className="bottom-text">
            No tengo ninguna cuenta, <Link to="/setUp">Crear cuenta</Link>
          </div>
        </div>
      </div>
    </Layout >
  );
}