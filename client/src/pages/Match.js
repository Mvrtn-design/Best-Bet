import React from "react";
import Layout from "./partials/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import MatchGenerator from "../routes/route_match";

function Match() {
  const ESTADOS = {
    SIN_JUGAR: 0,
    EN_JUEGO: 1,
    TERMINADO: 2,
  };

  const [clubNames, setClubNames] = useState([]);
  const [equipoLocal, setEquipoLocal] = useState([]);
  const [equipoVisitante, setEquipoVisitante] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [buttonColor, setButtonColor] = useState('blue');

  useEffect(() => {
    // This effect will run whenever selectedButton changes
    // Update the button color immediately after updating selectedButton
    setButtonColor(selectedButton === null ? 'blue' : 'white');
  }, [selectedButton]);

  const handleButtonClick = (buttonId) => {
    // Update the selected button when clicked
    setSelectedButton(buttonId);
  };

  const [partidoInfo, setPartidoInfo] = useState({
    local: 'equipoLocal',
    visitante: 'equipoVisitante',
    golesLocal: 0,
    golesVisitante: 0,
    estado: ESTADOS.SIN_JUGAR,
    localizacion: 0,
    competicion: "",
    fecha: 0,
    local_cuota: 0.0,
    empate_couta: 0.0,
    visitante_cuota: 0.0,
  });
  
  const [partidoHTML, setPartidoHTML] = useState("");

  useEffect(() => {
    setEquipoLocal("");
    setEquipoVisitante("");
  }, []);
  const EstablecerEquipoLocal = (event) => {
    setEquipoLocal(JSON.parse(event.target.value));
  };

  const EstablecerEquipoVisitante = (event) => {
    setEquipoVisitante(JSON.parse(event.target.value));
  };
  

  const ShowMatch = () => {
    
    if (equipoLocal.id === equipoVisitante.id) {
      setPartidoHTML(<h2>NO SE PUEDEN ELEGIR EL EQUIPO</h2>);

    } else {
      const match_info = new MatchGenerator(equipoLocal, equipoVisitante);     
      setPartidoInfo(match_info.getPreMatch());
      console.log(partidoInfo);
      const playMatch = () => {
        return 1;
      };

      setPartidoHTML(
        <div className="partido-container">
          <div className="card">
            <div className="card-cabecera">
              <div className="partido-estado">{partidoInfo.estado}</div>
              <div className="partido-competicion">
                <img src="/imagenes/logo.jpg" alt="amistoso" />
                {partidoInfo.competicion}
              </div>
              <div className="partido-accion">
                <button className="btn-icon">
                  <i className="material-icon">Info</i>
                </button>
                <button className="btn-icon">
                  <i className="material-icon">Alertas</i>
                </button>
              </div>
            </div>

            <div className="card-body">
              <div className="columna">
                <div className="equipo">
                  <div className="equipo-logo">
                    <img src="/imagenes/team1_logo.png" alt="teamA" />
                  </div>
                  <h2 className="local-nombre">{partidoInfo.local}</h2>
                </div>
              </div>
              <div className="columna">
                <div className="partido-detalles">
                  <div className="partido-fecha">{partidoInfo.fecha}</div>
                  <div className="partido-marcador">
                    <span className="local-marcador">{partidoInfo.golesLocal}</span>
                    <span>-</span>
                    <span className="visitante-marcador">
                      {partidoInfo.golesVisitante}
                    </span>
                  </div>
                  <div className="partido-minuto">-'</div>
                  <div className="partido-estadio">
                    Estadio: <strong>{partidoInfo.localizacion}</strong>
                  </div>
                  <div className="partido-apuestas">
                    <button className="partido-apuestas-local"
                    style={{ backgroundColor: buttonColor }}
                    onClick={() => handleButtonClick(1)}>
                      {partidoInfo.local_cuota}
                    </button>
                    <button className="partido-apuestas-empate"
                    style={{ backgroundColor: buttonColor }}
                    onClick={() => handleButtonClick(2)}>
                      {partidoInfo.empate_couta}
                    </button>
                    <button className="partido-apuestas-visitante"
                    style={{ backgroundColor: buttonColor }}
                    onClick={() => handleButtonClick(3)}>
                      {partidoInfo.visitante_cuota}
                    </button>
                  </div>
                  <button id="playMatch" onClick={playMatch}>
                    JUGAR
                  </button>
                  <p>Selected Button: {selectedButton || ''}</p>
                </div>
              </div>
              <div className="columna">
                <div className="equipo">
                  <div className="equipo-logo">
                    <img src="/imagenes/team2_logo.png" alt="teamA" />
                  </div>
                  <h2 className="visitante-nombre">{partidoInfo.visitante}</h2>
                </div>
              </div>
            </div>
          </div>
          <p id="partido-apuesta-texto"></p>
          <p id="partido-apuesta-veredicto"></p>
        </div>
      );
      }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/getClubes")
      .then((result) => {
        setClubNames(result.data);
      })
      .catch((err) => {
        console.error("No va por: ", err);
      });
  }, []);

  return (
    <Layout>
      <div>
        <h1>PARTIDO</h1>
        <h2>SELECCIONE LOS EQUIPOS</h2>
        <select
          id="seleccionarEquipoLocal"
          value={JSON.stringify(equipoLocal)}
          onChange={EstablecerEquipoLocal}
        >
          <option value="">-- Equipo Local --</option>
          {Object.entries(clubNames).map(([key, value]) => (
            <option key={key} value={JSON.stringify(value)}>
              {value.name}
            </option>
          ))}
        </select>

        <select
          id="seleccionarEquipoVisitante"
          value={JSON.stringify(equipoVisitante)}
          onChange={EstablecerEquipoVisitante}
        >
          <option value="">-- Equipo Visitante --</option>
          {Object.entries(clubNames).map(([key, value]) => (
            <option key={key} value={JSON.stringify(value)}>
              {value.name}
            </option>
          ))}
        </select>

        <button id="jugarPartido" onClick={ShowMatch}>
          VER PARTIDO
        </button>
        {partidoHTML}
      </div>
    </Layout>
  );
}



export default Match;
