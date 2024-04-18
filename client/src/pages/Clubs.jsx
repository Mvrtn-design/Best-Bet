import React from "react";
import axios from "axios";
import Help from "./partials/Help";
import { useEffect, useState } from "react";
import Layout from "./partials/Layout";

function Clubs() {
  const [listaClubes, setListaClubes] = useState([]);
  const [clubInfo, setClubInfo] = useState("");
  const [clubInfoCache, setClubInfoCache] = useState({});
  const [openHelp, setopenHelp] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleClickOpenHelp() {
    setopenHelp(!openHelp);
  }

  const getClubInfo = async (value) => {
    if (clubInfoCache[value]) {
      setClubInfo(clubInfoCache[value]);
      return;
    }
    try {
      const result = await axios.get(
        `http://localhost:3001/getClubByName/${value}`
      );
      const colores_data = result.data[0].colors;
      const colores = colores_data.split('"').filter((str, index) => index % 2 === 1);
      const clubInfo = (
        <div className="club-container">
          <div className="card-cabecera">
            <h2>{result.data[0].name}</h2>
          </div>
          <p>
            <strong>Nombre Completo:</strong> {result.data[0].full_name}
          </p>
          <p>
            <strong>País:</strong> {result.data[0].country}
          </p>
          <p>
            <strong>Estadio:</strong> {result.data[0].stadium}
          </p>
          <p>
            <strong>Colores:</strong> {colores}
          </p>
          <p>
            <strong>Apodo:</strong> {result.data[0].nickname}
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
      .get("http://localhost:3001/getClubes")
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
        <h2>Cuadro de ayuda para la página de inicio</h2>
        <p>
          Bienvenido a la página de Clubes Esta página está diseñada para proporcionarle información sobre diversos clubes deportivos de toda la plataforma. Aquí tienes un desglose de las diferentes secciones de la página:
          <ul>- Lista de clubes: En la parte izquierda de la página encontrarás una lista de clubes. Cada nombre de club es un botón sobre el que se puede hacer clic. Al hacer clic en el nombre de un club, la página mostrará información detallada sobre ese club en la parte derecha de la página. </ul><ul>- Información del club: Al hacer clic en el nombre de un club, la información del club aparecerá en esta sección. La información suele incluir el nombre completo del club, el país, el estadio, los colores y el apodo. Esta información se obtiene de un servidor mediante una API, por lo que puede tardar un momento en cargarse.
        </ul> </p>
        <div style={{ backgroundColor: `red` }} className="my-div">
          ...
        </div>
      </Help>
    );
  }

  return (
    <Layout>
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
