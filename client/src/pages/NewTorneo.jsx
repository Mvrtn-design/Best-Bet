import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./partials/Layout";

function NewTorneo() {
  const [user, setUser] = useState({});
  const [competiciones, setCompeticiones] = useState([]);
  const [form, setForm] = useState({
    usuario: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/get1user")
      .then((response) => {
        const userData = response.data[0];
        setUser(userData);
        setForm({ ...form, usuario: userData.id });
        getCompeticionesByUser(response.data[0]).then((datosCompeticion) => {
          setCompeticiones(datosCompeticion);
        });
        
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [form]);

  const navigate = useNavigate();

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
        //crearCompeticion();
        navigate(`/menu/${datos}/${datosCompeticion.data}`);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
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
              <th>Actions</th>
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
                  <Link to={`/menu/${item.partida}/${item.ID}`}> ENTRAR </Link>
                  <button>ELIMINAR</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>NUEVO TORNEO</h2>
        <form onSubmit={handleSubmit}>
          <label>Temporada: </label>
          <label>
            <input
              type="text"
              name="nombre"
              value={"2023-2024"}
              readOnly
            ></input>
          </label>
          <label>Nombre usuario: </label>
          <label>
            <input
              type="text"
              name="nombre_usuario"
              value={user.nombre_usuario}
              readOnly
            ></input>
          </label>
          <input type="submit" value="COMENZAR"></input>
        </form>
      </Layout>
    </>
  );
}
async function postCompetition(idPartida) {
  const idP = idPartida;
  const formData = {
    nombre: "champions1",
    partida: idP,
    temporada: "2022-2023",
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

async function getCompeticionesByUser(idUser) {
  const idP = idUser.id;
  try {
    const responseCompeticion = await axios.get(
      `http://localhost:3001/getCompeticionByUser/${idP}`
    );
    return responseCompeticion.data;
  } catch (error) {
    console.error("Error getting competitions:", error);
  }
}

export default NewTorneo;
