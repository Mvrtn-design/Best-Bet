import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./partials/Layout";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  const [user, setUser] = useState({});
  const [competiciones, setCompeticiones] = useState([]);
  const { setAuthState } = useContext(AuthContext);

  const navigate = useNavigate();

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
          const userData = response.data[0];
          setUser(userData);
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);
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
      <label>
        <p>Monedas: </p>
        <p>{user.monedas}</p>
      </label>

      <div>
        <button onClick={handleLogOut}>CERRAR SESION</button>
      </div>
    </Layout>
  );
}

export default Profile;
