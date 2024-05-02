import React from "react";
import Layout from "./partials/Layout";
import { useLocation } from "react-router-dom";
import Help from "./partials/Help";
import axios from "axios";
import { AiFillBackward } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHelpText } from "./partials/HelpTexts";
import getAPI_URL from "../helpers/api_url";

function Grupo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grupo, setGrupo] = useState(null);
  const location = useLocation();
  const groupId = location.state.group;
  const usuario = location.state.usuario;
  let navigate = useNavigate();
  const [openHelp, setopenHelp] = useState(false);

  const fetchMatchInfo = async () => {
    console.log("GETTING GROUP INFO");
    setLoading(true);
    try {
      setUser(usuario);
      const response = await axios.get(
        `${getAPI_URL}/getGrupoById/${groupId}`
      );
      setGrupo(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  function handleClickOpenHelp() {
    setopenHelp(!openHelp);
  }
  useEffect(() => {
    fetchMatchInfo();
  }, [user]);

  if (openHelp) {
    return (
      <Help trigger={openHelp} setTrigger={setopenHelp}>
        {getHelpText("home")}
      </Help>)
  }


  return (
    <Layout>
      {loading && <p>Loading...</p>}
      {grupo && (
        <div>
          <button className="back-button" onClick={() => navigate(-1)}><AiFillBackward /> Volver</button>
          <h1>Grupo {grupo[0].letra}</h1>

          <table className="tabla_usuarios">
            <thead>
              <tr>
                <th >NOMBRE</th>
                <th >VICTORIAS</th>
                <th >EMPATES</th>
                <th >DERROTAS</th>
                <th >GOLES MARCADOS </th>
                <th >GOLES ENCAJADOS</th>
                <th >
                  <strong>PUNTOS</strong>
                </th>
              </tr>
            </thead>
            <tbody>
              {grupo.map((club, index) => (
                <tr key={index}>
                  <td><strong>{club.name}</strong></td>
                  <td>{club.ganados}</td>
                  <td>{club.empatados}</td>
                  <td>{club.perdidos}</td>
                  <td>{club.goles_a_favor}</td>
                  <td>{club.goles_en_contra}</td>
                  <td><strong>{club.puntos}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="button-help" onClick={handleClickOpenHelp}>?</button>
        </div>
      )}
    </Layout>
  );
}

export default Grupo;
