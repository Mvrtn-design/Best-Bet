import React from "react";
import Layout from "./partials/Layout";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import MatchGenerator from "../routes/route_match";

function Match_Info() {
  const [match, setMatch] = useState(null);
  const [matchTemp, setMatchTemp] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [betFormOpen, setBetFormOpen] = useState(false);
  const [posibilties, setPosibilities] = useState([
    { name: "local", price: 0 },
    { name: "draw", price: 0 },
    { name: "away", price: 0 },
  ]);
  const [amountToPlay, setAmountToPlay] = useState(1);
  const [bet, setBet] = useState(0);
  const [formCuota, setFormCuota] = useState(0);

  const initialState = posibilties.reduce((acc, posibilty) => {
    acc[posibilty.name] = { price: 0, amount: 0, potencialWin: 0 };
    return acc;
  }, {});
  const [betState, setBetState] = useState(initialState);
  const [bets, setBets] = useState([]);

  const id_match = location.state.match;
  const usuario = location.state.usuario;

  const fetchMatchInfo = async () => {
    console.log("GETTING INFO");
    try {
      setLoading(true);
      setUser(usuario);
      const response = await axios.get(
        `http://localhost:3001/getPartidoById/${id_match}`
      );
      const match_info = await response.data[0];

      setMatch(match_info);
      console.log(match_info);
      setPosibilities([
        { name: "local", price: match_info.cuota_local },
        { name: "draw", price: match_info.cuota_empate },
        { name: "away", price: match_info.cuota_visitante },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  useEffect(() => {
    fetchMatchInfo();
  }, [matchTemp]);

  const handleBet = (betResult) => {
    setFormCuota(match.cuota_empate);
    setBetFormOpen(true);
    setBet(betResult);
  };
  const handleBetSubmit = () => {
    setBets((prevBets) => [
      ...prevBets,
      ...posibilties.map((posibility) => ({
        posibilty: posibility.name,
        amount: betState[posibility.name].amount,
        potencialWin: betState[posibility.name].potencialWin,
      })),
    ]);
    setBetFormOpen(false);
  };
  const handleDeleteBet = (index) => {
    const updatedBets = bets.filter((_, i) => i !== index);
    setBets(updatedBets);
  };

  const increaseAmount = (BetName) => {
    setBetState((prevState) => {
      const newState = { ...prevState };
      newState[BetName].amount += 1;
      newState[BetName].potencialWin += posibilties.find(
        (posibilty) => posibilty.name === BetName
      ).price;
      return newState;
    });
  };

  const decreaseAmount = (betName) => {
    setBetState((prevState) => {
      const newState = { ...prevState };
      if (newState[betName].amount > 0) {
        newState[betName].amount -= 1;
        newState[betName].potencialWin -= posibilties.find(
          (posibilty) => posibilty.name === betName
        ).price;
        return newState;
      }
    });
  };
  const handleCancel = () => {
    setBetState(initialState);
  };
  async function handlePlayMatch() {
    const marcador_local = Math.round(Math.random() * 4);
    const marcador_visitante = Math.round(Math.random() * 4);
    const estado_partido = "ENDED";

    await axios.put(
      `http://localhost:3001/updateResultadoPartido/${id_match}`,
      {
        value1: marcador_local,
        value2: marcador_visitante,
        value3: estado_partido,
      }
    );

    //Local
    await axios.put(
      `http://localhost:3001/updateEstadisticasEquipo/${match.club_local}/${match.id_group}`,
      {
        marcados: marcador_local,
        encajados: marcador_visitante,
        ganados: marcador_local > marcador_visitante ? 1 : 0,
        empatados: marcador_local === marcador_visitante ? 1 : 0,
        perdidos: marcador_local < marcador_visitante ? 1 : 0,
        puntos:
          marcador_local > marcador_visitante
            ? 3
            : marcador_local == marcador_visitante
            ? 1
            : 0,
      }
    );

    //Visitante
    await axios.put(
      `http://localhost:3001/updateEstadisticasEquipo/${match.club_visitante}/${match.id_group}`,
      {
        marcados: marcador_visitante,
        encajados: marcador_local,
        ganados: marcador_local < marcador_visitante ? 1 : 0,
        empatados: marcador_local === marcador_visitante ? 1 : 0,
        perdidos: marcador_local > marcador_visitante ? 1 : 0,
        puntos:
          marcador_local < marcador_visitante
            ? 3
            : marcador_local == marcador_visitante
            ? 1
            : 0,
      }
    );

    fetchMatchInfo();
  }
  return (
    <Layout>
      {loading && <p>Loading...</p>}
      {user && (
        <div>
          <p>Nombre Usuario: {user?.nombre_usuario}</p>
          <p>Monedas: {user?.monedas}</p>
        </div>
      )}

      {match && (
        <>
          <div className="match-container">
            <div className="match">
              <div className="match-header">
                <button>Estadisticas</button>
                <button>Alertas</button>
                <div className="match-date">{match.fecha}</div>
                <div className="match-location">
                  {match.stadium} in {match.location}{" "}
                </div>
                <div className="match-status">{match.estado_partido}</div>
              </div>
              <div className="match-body"></div>
              <div className="match-column"></div>
              <div className="match-column"></div>
              <div className="match-column"></div>

              <h1>
                {match.club_local} {match.marcador_local}-
                {match.marcador_visitante}
                {match.club_visitante}
              </h1>

              <div>
                - 1: {match.cuota_local}
                X: {match.cuota_empate}
                2: {match.cuota_visitante}
              </div>
              <div className="match-simulate">
                <button
                  onClick={() => handlePlayMatch()}
                  disabled={loading || match.estado_partido !== "READY_TO_PLAY"}
                >
                  JUGAR PARTIDO
                </button>
              </div>
            </div>
          </div>

          <h2>APUESTAS</h2>
          {posibilties.map((posibilty) => (
            <div key={posibilty.name}>
              <h2>
                {posibilty.name.charAt(0).toUpperCase() +
                  posibilty.name.slice(1)}
              </h2>
              <h3>Amount: {betState[posibilty.name].amount}</h3>
              <h3>
                Potencial Win: $
                {betState[posibilty.name].potencialWin.toFixed(2)}
              </h3>
              <button onClick={() => increaseAmount(posibilty.name)}>
                Increase Amount
              </button>
              <button
                onClick={() => decreaseAmount(posibilty.name)}
                disabled={loading || betState[posibilty.name].amount <= 0}
              >
                Decrease Amount
              </button>
            </div>
          ))}
          <button onClick={handleBetSubmit}>Submit</button>
          <button onClick={handleCancel}>Cancel</button>
          <h2>BETS</h2>
          <ul>
            {bets.map((purchase, index) =>
              purchase.amount > 0 ? (
                <li key={index}>
                  {purchase.amount} monedas apostadas {purchase.posibilty} for $
                  {purchase.totalPrice}
                </li>
              ) : null
            )}
          </ul>
        </>
      )}
    </Layout>
  );
}
export default Match_Info;
