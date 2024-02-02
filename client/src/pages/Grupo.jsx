import React from "react";
import Layout from "./partials/Layout";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function Grupo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grupo, setGrupo] = useState(null);
  const [ordenTabla, setOrdenTabla] = useState({ key: 'PUNTOS', direction: 'desc' })
  const location = useLocation();
  const groupId = location.state.group;
  const usuario = location.state.usuario;

  const fetchMatchInfo = async () => {
    console.log("GETTING INFO");
    setLoading(true);
    try {
      setUser(usuario);
      const response = await axios.get(
        `http://localhost:3001/getGrupoById/${groupId}`
      );
      setGrupo(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  useEffect(() => {
    fetchMatchInfo();
  }, [usuario]);

  // useEffect(() => {
  //   ordenarTabla(ordenTabla.key, ordenTabla.direction);
  // }, [ordenTabla]);

  // const ordenarTabla = (key, direction) => {
  //   let tablaOrdenada;
  //   if (direction === 'desc') {
  //     tablaOrdenada = [...grupo].sort((a, b) => b[key] - a[key]);
  //   } else {
  //     tablaOrdenada = [...grupo].sort((a, b) => a[key] - b[key]);
  //   }
  //   setGrupo(tablaOrdenada);
  //   setOrdenTabla({ key, direction })
  // }

  return (
    <Layout>
      {loading && <p>Loading...</p>}
      {grupo && (
        <div>
          <h1>Grupo {grupo[0].letra}</h1>

          <table className="tabla_usuarios">
            <thead>
              <tr>
                <th onClick={() => ordenarTabla('name', ordenTable.direction === 'desc' ? 'asc' : 'desc')}>NOMBRE</th>
                <th onClick={() => ordenarTabla('ganados', ordenTable.direction === 'desc' ? 'asc' : 'desc')}>VICTORIAS</th>
                <th onClick={() => ordenarTabla('empatados', ordenTable.direction === 'desc' ? 'asc' : 'desc')}>EMPATES</th>
                <th onClick={() => ordenarTabla('perdidos', ordenTable.direction === 'desc' ? 'asc' : 'desc')}>DERROTAS</th>
                <th onClick={() => ordenarTabla('goles_a_favor', ordenTable.direction === 'desc' ? 'asc' : 'desc')}>GOLES MARCADOS </th>
                <th onClick={() => ordenarTabla('goles_en_contra', ordenTable.direction === 'desc' ? 'asc' : 'desc')}>GOLES ENCAJADOS</th>
                <th onClick={() => ordenarTabla('diferencia', ordenTable.direction === 'desc' ? 'asc' : 'desc')}>DIFERENCIA</th>
                <th onClick={() => ordenarTabla('puntos', ordenTable.direction === 'desc' ? 'asc' : 'desc')}>
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
                  <th>{club.perdidos}</th>
                  <td>{club.goles_a_favor}</td>
                  <td>{club.goles_en_contra}</td>
                  <td>{club.diferencia}</td>
                  <td><strong>{club.puntos}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

export default Grupo;
