import React from "react";
import axios from "axios";
import { useEffect, useState } from "react"; //para cargar las cosas automaticamente "como los post de instagram"(efecto visual)
import Layout from "./partials/Layout";
function Clubs() {
  const [listaClubes, setListaClubes] = useState([]);
  const [clubInfo, setClubInfo] = useState("");

  const getClubInfo = async (value) => {
    try {
      const result = await axios.get(
        `http://localhost:3001/getClubInfo/${value}`
      );
      setClubInfo(
        <div className="card">
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

  return (
    <Layout>
      <h1>CLUBS INFO</h1>

      {listaClubes.map((value, index) => {
        return (
          <div className="club" key={index}>
            <p onClick={() => getClubInfo(value.ID)}>- {value.name}</p>
          </div>
        );
      })}
      {clubInfo}
    </Layout>
  );
}

export default Clubs;
