import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import Layout from "./partials/Layout";
import Help from "./partials/Help";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState({});
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openHelp, setopenHelp] = useState(false);

  function handleClickOpenHelp() {
    setopenHelp(!openHelp);
  }

  const handleLogOut = async () => {
    setAuthState(false);
    localStorage.removeItem("tokenAcceso");
    navigate("/");
  };

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
        }
      })
  }, );

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
      <h1>PERFIL</h1>
      <label>
        <p>Nombre: </p>
        <p>{user.nombre}</p>
      </label>
      <label>
        <p>Nombre Usuario: </p>
        <p>{user.nombre_usuario}</p>
      </label>
      <label>
        <p>Correo electronico: </p>
        <p>{user.correo_electronico}</p>
      </label>

      <div>
        <button onClick={handleLogOut}>CERRAR SESION</button>
      </div>
      <button className="button-help" onClick={handleClickOpenHelp}>?</button>
    </Layout>
  );
}

export default Profile;
