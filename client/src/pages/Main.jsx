import { Link } from "react-router-dom";
import Layout from "./partials/Layout";
import Help from "./partials/Help";
import jsonFile from "../files/fichero_equipos.json";
import axios from "axios";
import { React, useEffect, useState } from "react";
import { getHelpText } from "./partials/HelpTexts";


function Main() {
  const [openHelp, setopenHelp] = useState(false);

  function handleClickOpenHelp() {
    setopenHelp(!openHelp);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let responseNumTeams = await axios.get("http://localhost:3001/getTeamsNumber");
        if (responseNumTeams.data === 0) {
          await axios.post("http://localhost:3001/storeClubsJSON", jsonFile);
          console.log('JSON data stored successfully');
        }
      } catch (error) {
        console.error(`There was an error retrieving the data: ${error}`);
      }
    };
    fetchData();
  }, []);
  if (openHelp) {
    return (
      <Help trigger={openHelp} setTrigger={setopenHelp}>
        {getHelpText("home")}
      </Help>)
  }
  return (
    <Layout>
      <h1>PÁGINA PRINCIPAL</h1>
      <div className="wrapper-galeria">
        <figure className="item-galeria">
          <img src="../pictures/futbolin.jpg" alt="" className="item-imagen" />
          <figcaption className="item-descripcion">
            <Link to="/match">
              <h2 className="nombre">Amistoso</h2>
              <span className="rol">Partido rápido de Prueba</span>
            </Link>
          </figcaption>
        </figure>
        <figure className="item-galeria">
          <img src="../pictures/stand_stadium.jpg" alt="" className="item-imagen" />
          <figcaption className="item-descripcion">
            <Link to="/clubs">
              <h2 className="nombre">Visualizar clubes</h2>
              <span className="rol">
                Obtén información de los equipos
              </span>
            </Link>
          </figcaption>
        </figure>
        <figure className="item-galeria">
          <img
            src="../pictures/tournament.jpg"
            alt="Torneo"
            className="item-imagen"
          />
          <figcaption className="item-descripcion">
            <Link to="/torneo">
              <h2 className="nombre">Torneo</h2>
              <span className="rol">Entra al modo competición</span>
            </Link>
          </figcaption>
        </figure>
      </div>
      <button className="button-help" onClick={handleClickOpenHelp}>?</button>
    </Layout>
  );
}

export default Main;
