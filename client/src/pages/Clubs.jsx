import React, { useEffect, useState } from "react";
import axios from "axios";
import Help from "./partials/Help";
import { getHelpText } from "./partials/HelpTexts";
import Layout from "./partials/Layout";
import { useNavigate } from "react-router-dom";
import { AiFillBackward } from "react-icons/ai";
import getAPI_URL from "../helpers/api_url";

function Clubs() {
  const [listaClubes, setListaClubes] = useState([]);
  const [clubInfo, setClubInfo] = useState("");
  const [clubInfoCache, setClubInfoCache] = useState({});
  const [openHelp, setopenHelp] = useState(false);
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  function handleClickOpenHelp() {
    setopenHelp(!openHelp);
  }

  const getClubInfo = async (value) => {
    if (clubInfoCache[value]) {
      setClubInfo(clubInfoCache[value]);
      return;
    }
    try {
      const result = await axios.get(`${getAPI_URL()}/getClubByName/${value}`);
      const colores_data = result.data[0].colors;
      const colores = colores_data.split('"').filter((str, index) => index % 2 === 1);
      const clubInfo = (
        <div className="club-container">
          <div className="card-cabecera">
            <h2>{result.data[0].name}</h2>
          </div>
          <p>
            <strong>Nombre Completo : </strong> {result.data[0].full_name}
          </p>
          <p>
            <strong>País : </strong> {result.data[0].country}
          </p>
          <p>
            <strong>Estadio : </strong> {result.data[0].stadium}
          </p>
          <p>
            <strong>Colores : </strong> {colores}
          </p>
          <p>
            <strong>Apodo : </strong> {result.data[0].nickname}
          </p>
        </div>
      );
      setClubInfo(clubInfo);
      setClubInfoCache({ ...clubInfoCache, [value]: clubInfo });
    } catch (error) {
      console.error("Error fetching: ", error);
      setClubInfo(<div>Error al obtener la información del club</div>);
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${getAPI_URL}/getClubes`)
      .then((result) => {
        setListaClubes(result.data);
      })
      .catch((err) => {
        console.error("No va por: ", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (openHelp) {
    return (
      <Help trigger={openHelp} setTrigger={setopenHelp}>
        {getHelpText("clubs")}
      </Help>
    );
  }

  return (
    <Layout>
      <button className="back-button" onClick={() => navigate(-1)}><AiFillBackward /> Volver</button>
      <h1>INFORMACIÓN DE LOS EQUIPOS</h1>
      <div className="clubes">
        <ul className="club-list">
          {listaClubes.map((value, index) => {
            return (
              <li className="club" key={index}>
                <button onClick={() => getClubInfo(value.name)}>{value.name}</button>
              </li>
            );
          })}
        </ul>
        <div className="club-info">{clubInfo}</div>
      </div>
      <button className="button-help" onClick={handleClickOpenHelp}>
        ?
      </button>
    </Layout>
  );
}

export default Clubs;
