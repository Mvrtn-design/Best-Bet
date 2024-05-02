import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Help from "./partials/Help";
import axios from "axios";
import { AiFillBackward } from "react-icons/ai";
import Layout from "./partials/Layout";
import getAPI_URL from "../helpers/api_url";

function NewTorneo() {

  const [competiciones, setCompeticiones] = useState([]);
  const [openHelp, setopenHelp] = useState(false);
  const [user, setUser] = useState({});
  const inicio_temporada = 2023;
  const temporada_actual = `${inicio_temporada}-${inicio_temporada + 1}`;
  const [form, setForm] = useState({
    nombre_usuario: "",
    temporada: temporada_actual,
    nombre_torneo: "",
    monedas: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${getAPI_URL}/getLogUser`, {
        headers: { tokenAcceso: localStorage.getItem("tokenAcceso") },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          navigate("/logIn");
        } else {
          const userData = response.data;
          setUser(userData.id);
          setForm({ ...form, nombre_usuario: userData.id })
          getCompeticionesByUser(response.data.id).then((datosCompeticion) => {
            setCompeticiones(datosCompeticion);
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    try {
      postPartida(form).then((respuestaServe) => {
        postCompetition(respuestaServe).then((datosCompeticion) => {
          navigate(`/menu/${respuestaServe}/${datosCompeticion.data}`);
        });
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
  async function postPartida() {
    try {
      const response = await axios.post(`${getAPI_URL}/addPartida`, {
        body: user,
      });
      return response.data;
    } catch (errr) {
      console.error("Error:", errr);
      return ({ error: errr })
    }
  }

  async function postCompetition(idPartida) {
    const formData = {
      nombre: form.nombre_torneo,
      partida: idPartida,
      temporada: form.temporada,
      monedas: form.monedas,
    };

    try {
      const responseCompeticion = await axios.post(
        `${getAPI_URL}/addCompeticion`,
        formData
      );
      return responseCompeticion;
    } catch (error) {
      console.error("Error posting competition:", error);
      alert("Error creando la competicion");
      navigate("/");
    }
  }
  async function handleEliminarCompeticion(idCompeticion) {
    try {
      console.log(idCompeticion);
      await axios.get(`${getAPI_URL}/eliminarCompeticion`, {
        idd: idCompeticion
      });
      alert("Partida Eliminada");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  async function getCompeticionesByUser(id_usuario) {
    try {
      const responseCompeticion = await axios.get(
        `${getAPI_URL}/getCompeticionByUser/${id_usuario}`
      );
      return responseCompeticion.data;
    } catch (error) {
      console.error("Error getting competitions:", error);
      alert("Error de carga");
      navigate("/");
    }
  }

  function handleClickOpenHelp() {
    setopenHelp(!openHelp);
  }

  if (openHelp) {
    return (
      <Help trigger={openHelp} setTrigger={setopenHelp}>

        <h2 >Cuadro de ayuda: Carga y creación de Torneos</h2>
        <p>Esta sección te ofrece información sobre cómo utilizar el sitio web.
          Si tienes alguna duda o inquietud no dudes en preguntarnos.       </p>
        <div style={{ backgroundColor: `red` }} className="my-div" >
          ...
        </div>
      </Help>)
  }

  return (
    <Layout>
      <button className="back-button" onClick={() => navigate(-1)}><AiFillBackward /> Volver</button>
      <h1>TORNEO</h1>
      <h2>TORNEOS GUARDADOS</h2>
      <table className="tabla_usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>NOMBRE</th>
            <th>TEMPORADA</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {competiciones.map((item) => (
            <tr key={item.ID}>
              <td>{item.ID}</td>
              <td>{item.nombre}</td>
              <td>{item.temporada}</td>
              <td>
                <button
                  onClick={() => navigate(`/menu/${item.partida}/${item.ID}`)}
                >
                  ENTRAR
                </button>
                <button type="button" onClick={() => handleEliminarCompeticion(item.ID)}>ELIMINAR</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr></hr>
      <h2>NUEVO TORNEO</h2>

      <form className="form-torneo" onSubmit={handleSubmit}>
        <label>
          Nombre Torneo:
          <input type='text'
            name='nombre_torneo'
            placeholder="Inserte nombre del torneo"
            autoComplete="on"
            required
            value={form.nombre_torneo}
            onChange={(e) => setForm({ ...form, nombre_torneo: e.target.value })}>
          </input>
          <br />
        </label>
        <label>
          Temporada:
          <input
            type="text"
            name="nombre"
            value={temporada_actual}
            readOnly
          ></input>
        </label>
        <label>
          Regalo de Bienvenida:
          <br /><input name="monedas" type='radio' label='Dificultad_baja' required value='100' checked={form.monedas === 100} onChange={() => setForm({ ...form, monedas: 100 })} /> Dificultad Baja: 100 monedas
          <br /><input name="monedas" type='radio' label='Dificultad_media' required value='20' checked={form.monedas === 20} onChange={() => setForm({ ...form, monedas: 20 })} /> Dificultad media: 20 monedas
          <br /><input name="monedas" type='radio' label='Dificultad_alta' required value='1' checked={form.monedas === 1} onChange={() => setForm({ ...form, monedas: 1 })} /> Dificultad alta: 1 moneda<br />
        </label>
        <button className="button-important" type="submit">COMENZAR NUEVA COMPETICION</button>
        <button type="reset">BORRAR CAMPOS</button>
      </form>
      <button className="button-help" onClick={handleClickOpenHelp}>?</button>
    </Layout >
  );
}

export default NewTorneo;
