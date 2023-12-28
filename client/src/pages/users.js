import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "./partials/Layout";
import axios from "axios";

const PreviousData = () => {
  const [usuario, setUsuario] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:3001/getUsers")
      .then((result) => {
        setUsuario(result.data);
      })
      .catch((err) => {
        console.error("No va por: ", err);
      });
  }, []);

  return (
    <Layout>
      <div className="App">
        <h1>Lista usuarios</h1>

        <h2>Usuarios guardados</h2>
        <table className="tabla_usuarios">
          <thead>
            <tr>
              <th>nº</th>
              <th>Name</th>
              <th>User</th>
              <th>e-mail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { usuario.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombre}</td>
                  <td>{item.nombre_usuario}</td>
                  <td>{item.correo_electronico}</td>
                  <td>
                    <button>
                      ELIMINAR
                    </button>
                    <button>EDITAR</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default PreviousData;
