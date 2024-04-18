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
        <hr></hr>
        <p>Bienvenido a nuestra página web. Esta es la página principal, donde encontrará enlaces rápidos a diversas funciones de nuestra plataforma.
          En la parte superior de la página, verá un encabezado con el título "Página principal". Esto indica que se encuentra en la página principal de nuestro sitio web. </p>
          <p>
          Debajo de la cabecera, encontrará una galería de imágenes con enlaces a diferentes secciones de nuestra plataforma. La primera imagen está vinculada a la página "Amistoso".
          Esta página te permite iniciar rápidamente un partido amistoso con otro usuario. La segunda imagen es una foto de un campo de fútbol, y está enlazada a la página "Visualizar clubes".</p>
          <p> Esta página te permite visualizar y gestionar los diferentes clubes de fútbol que forman parte de nuestra plataforma.
          La tercera imagen es una foto de un estadio, y está enlazada a la página "Torneo". Esta página te permite crear y gestionar torneos para los clubes de fútbol de nuestra plataforma.
          En la parte inferior de la página, encontrarás un botón con el icono de un signo de interrogación. Al hacer clic en este botón se abrirá una sección de ayuda con información sobre cómo utilizar nuestro sitio web. Si tienes alguna pregunta o duda, no dudes en preguntarnos.
          Esperamos que disfrute utilizando nuestra plataforma. Si tiene alguna sugerencia o comentario, no dude en hacérnoslo saber. Siempre estamos buscando formas de mejorar nuestro sitio web y ofrecer la mejor experiencia posible a nuestros usuarios.</p>
        <div style={{ backgroundColor: `red` }} className="my-div" >
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
