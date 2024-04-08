import { Link } from "react-router-dom";
import Layout from "./partials/Layout";
import Help from "./partials/Help";
import jsonFile from "../files/fichero_equipos.json";
import axios from "axios";
import { React, useEffect, useState } from "react";


function Main() {
  const [openHelp, setopenHelp] = useState(false);
  if (openHelp) {
    return (
      <Help trigger={openHelp} setTrigger={setopenHelp}>

        <h2 >Cuadro de ayuda para la página de inicio</h2>
        <p>Esta sección te ofrece información sobre cómo utilizar el sitio web.
          Si tienes alguna duda o inquietud no dudes en preguntarnos.</p>
        <div style={{ backgroundColor: `red`}} className="my-div" >
          ...
        </div>
      </Help>)
  }
  function handleClickOpenHelp() {
    setopenHelp(!openHelp);
  }

  //   useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //             await axios.post("http://localhost:3001/storeClubsJSON", jsonFile);
  //             console.log('JSON data stored successfully');
  //         } catch (error) {
  //             console.error(`There was an error retrieving the data: ${error}`);
  //         }
  //     };
  //     fetchData();
  // }, []);

  return (
    <Layout>
      <h1>Página principal</h1>
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
          <img src="../pictures/field_02.jpg" alt="" className="item-imagen" />
          <figcaption className="item-descripcion">
            <Link to="/clubs">
              <h2 className="nombre">Visualizar clubes</h2>
              <span className="rol">
                Copa, fase de grupos , eliminatrias...
              </span>
            </Link>
          </figcaption>
        </figure>
        <figure className="item-galeria">
          <img
            src="../pictures/stand_stadium.jpg"
            alt=""
            className="item-imagen"
          />
          <figcaption className="item-descripcion">
            <Link to="/torneo">
              <h2 className="nombre">Torneo</h2>
              <span className="rol">Nueva competicion liguera</span>
            </Link>
          </figcaption>
        </figure>
      </div>
      <button className="button-help" onClick={handleClickOpenHelp}>?</button>
    </Layout>
  );
}

export default Main;
