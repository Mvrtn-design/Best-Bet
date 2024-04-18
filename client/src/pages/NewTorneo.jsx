import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Layout from "./partials/Layout";
import Help from "./partials/Help";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';

function NewTorneo() {

  const [competiciones, setCompeticiones] = useState([]);
  const [openHelp, setopenHelp] = useState(false);
  const [user, setUser] = useState({});
  const [form, setForm] = useState({
    id_usuario: "",
  });
  const inicio_temporada = 2023;
  const temporada_actual = `${inicio_temporada}-${inicio_temporada + 1}`;
  const navigate = useNavigate();


  useEffect(() => {
    axios
      .get("http://localhost:3001/getLogUser", {
        headers: { tokenAcceso: localStorage.getItem("tokenAcceso") },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          navigate("/logIn");
        } else {
          const userData = response.data;
          setUser(userData);
          setForm({ ...form, id_usuario: userData.id });
          getCompeticionesByUser(response.data.id).then((datosCompeticion) => {
            setCompeticiones(datosCompeticion);
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/addPartida", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const datos = await response.json();

      postCompetition(datos).then((datosCompeticion) => {
        navigate(`/menu/${datos}/${datosCompeticion.data}`);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function postCompetition(idPartida) {
    const formData = {
      nombre: "champions1",
      partida: idPartida,
      temporada: temporada_actual,
    };

    try {
      const responseCompeticion = await axios.post(
        "http://localhost:3001/addCompeticion",
        formData
      );
      return responseCompeticion;
    } catch (error) {
      console.error("Error posting competition:", error);
    }
  }

  async function getCompeticionesByUser(id_usuario) {
    try {
      const responseCompeticion = await axios.get(
        `http://localhost:3001/getCompeticionByUser/${id_usuario}`
      );
      return responseCompeticion.data;
    } catch (error) {
      console.error("Error getting competitions:", error);
    }
  }
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Ingrese un correo electrónico válido")
      .required("Campo requerido"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("Contraseña es obligatoria"),
  });

  function handleClickOpenHelp() {
    setopenHelp(!openHelp);
  }

  if (openHelp) {
    return (
      <Help trigger={openHelp} setTrigger={setopenHelp}>

        <h2 >Cuadro de ayuda para la página de inicio</h2>
        <p>Esta sección te ofrece información sobre cómo utilizar el sitio web.
          Si tienes alguna duda o inquietud no dudes en preguntarnos.       </p>
        <div style={{ backgroundColor: `red` }} className="my-div" >
          ...
        </div>
      </Help>)
  }

  return (
    <Layout>
      <h1>TORNEO</h1>
      <h2>TORNEOS GUARDADOS</h2>
      <table className="tabla_usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>NOMBRE</th>
            <th>TEMPORADA</th>
            <th>ESTADO</th>
            <th>Accioness</th>
          </tr>
        </thead>
        <tbody>
          {competiciones.map((item) => (
            <tr key={item.ID}>
              <td>{item.ID}</td>
              <td>{item.nombre}</td>
              <td>{item.temporada}</td>
              <td>{item.estado}</td>
              <td>
                <button
                  onClick={() => navigate(`/menu/${item.partida}/${item.ID}`)}
                >
                  ENTRAR
                </button>
                <button>ELIMINAR</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr></hr>
      <Formik
        initialValues={{ temporada: temporada_actual, nombre_usuario: user.nombre_usuario, monedas: 0 }}
        validationSchema={loginSchema }
        onSubmit={handleSubmit}>
          <label>
            Temporada:
            <Field type='text' name='temporada' value={temporada_actual}
            readOnly />
          </label>
          <label>
            Nombre de Usuario:
          </label>

      </Formik>
      <h2>NUEVO TORNEO</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Temporada:
          <input
            type="text"
            name="nombre"
            value={temporada_actual}
            readOnly
          ></input>
        </label>
        <div>
          Nombre usuario:
          <input
            type="text"
            name="nombre_usuario"
            defaultValue={user.nombre_usuario}
            readOnly
          ></input>
        </div>
        <button type="submit">COMENZAR NUEVA COMPETICION</button>
      </form>
      <button className="button-help" onClick={handleClickOpenHelp}>?</button>
    </Layout>
  );
}

export default NewTorneo;
