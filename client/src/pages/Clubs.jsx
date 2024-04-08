import React from "react";
import axios from "axios";
import Help from "./partials/Help";
import { useEffect, useState } from "react"; //para cargar las cosas automaticamente "como los post de instagram"(efecto visual)
import Layout from "./partials/Layout";

function Clubs() {
  const [listaClubes, setListaClubes] = useState([]);
  const [clubInfo, setClubInfo] = useState("");
  const [openHelp, setopenHelp] = useState(false);

  
  function handleClickOpenHelp() {
    setopenHelp(!openHelp);
  }

  const getClubInfo = async (value) => {
    try {
      const result = await axios.get(
        `http://localhost:3001/getClubByName/${value}`
      );
      setClubInfo(
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
            <strong>Colores:</strong> {result.data[0].colors}
          </p>
          <p>
            <strong>Apodo:</strong> {result.data[0].nickname}
          </p>
        </div>
      );
    } catch (error) {
      console.error("Error fetching: ", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/getClubes")
      .then((result) => {
        setListaClubes(result.data);
      })
      .catch((err) => {
        console.error("No va por: ", err);
      });
  }, []);
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
      <h1>CLUBS INFO</h1>

      {listaClubes.map((value, index) => {
        return (
          <div className="club" key={index}>
            <p onClick={() => getClubInfo(value.name)}>- {value.name}</p>
          </div>
        );
      })}
      {clubInfo}
      <button className="button-help" onClick={handleClickOpenHelp}>?</button>
    </Layout>
  );
}

export default Clubs;
