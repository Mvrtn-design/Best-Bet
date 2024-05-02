import React from "react";
import Layout from "./partials/Layout";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { generateMatchResult } from "../routes/Route_matches";
import { useNavigate } from "react-router-dom";
import getAPI_URL from "../helpers/api_url";

function MatchInfo() {
  const [ID_distributor, setID_distributor] = useState(0);
  const [match, setMatch] = useState(null);
  const [betCard, setBetCart] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openTicket, setOpenTicket] = useState(false);
  const location = useLocation();
  const [competition, setCompetition] = useState(location.state.competition);
  const [openHelp, setopenHelp] = useState(false);
  const [ticket, setTicket] = useState({
    bets: [],
    bet_coins: 0,
    status: "",
    potencial_prize: 0.0,
  });
  const [bets, setBets] = useState(location.state.bets);

  const id_match = location.state.match;
  const usuario = location.state.usuario;
  const local = location.state.local;
  const visitante = location.state.visitante;


  let navigate = useNavigate();

  const fetchMatchInfo = async () => {
    console.log("GETTING INFO");
    try {
      setLoading(true);
      setUser(usuario);
      const response = await axios.get(
        `${getAPI_URL}/getPartidoById/${id_match}`, { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } }
      );
      const matchInfo = await response.data[0];
      console.log(visitante);

      setMatch(matchInfo);
      setLoading(false);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  function handleClickOpenHelp() {
    setopenHelp(!openHelp);
  }
  ////////////////////////////            APUESTAS           ///////////////////////////////////////////

  const handleBet = (match, cuota, bet_choice) => {
    const bet_aux = {
      bet_id: ID_distributor,
      match: match,
      match_ID: match.Idd,
      choice: bet_choice,
      odd: cuota,
    };

    setID_distributor(ID_distributor + 1);

    var bets_aux = ticket.bets;
    bets_aux.push(bet_aux);
    setTicket({ ...ticket, bets: bets_aux });

    var sumOdds = 0.0;
    for (let i = 0; i < ticket.bets.length; i++) {
      sumOdds += ticket.bets[i].odd;
    }
    setTicket((prevSidebar) => ({
      ...prevSidebar,
      potencial_prize: ticket.bet_coins * sumOdds,
    }));

    if (!openTicket) {
      setOpenTicket(true);
    }
  };
  const handleBetIncrease = async () => {
    if (competition.monedas > 0) {
      const aux_coins = ticket.bet_coins + 1;

      setTicket((prevSidebar) => ({
        ...prevSidebar,
        bet_coins: aux_coins,
      }));
      var sumOdds = 0.0;
      for (let i = 0; i < ticket.bets.length; i++) {
        sumOdds += ticket.bets[i].odd;
      }
      setTicket((prevSidebar) => ({
        ...prevSidebar,
        potencial_prize: aux_coins * sumOdds,
      }));
    }
  };
  const handleBetDecrease = async () => {
    if (ticket.bet_coins > 0) {
      const aux_coins = ticket.bet_coins - 1;

      setTicket((prevSidebar) => ({
        ...prevSidebar,
        bet_coins: aux_coins,
      }));
      var sumOdds = 0.0;
      for (let i = 0; i < ticket.bets.length; i++) {
        sumOdds += ticket.bets[i].odd;
      }
      setTicket((prevSidebar) => ({
        ...prevSidebar,
        potencial_prize: aux_coins * sumOdds,
      }));
    }
  };

  const handleDeleteBet = async (id) => {
    const bets_aux = ticket.bets.filter((x) => x.bet_id !== id);
    const count = bets_aux.length;
    setTicket({ ...ticket, bets: bets_aux });
    var sumOdds = 0.0;
    for (let i = 0; i < bets_aux.length; i++) {
      sumOdds += bets_aux[i].odd;
    }
    setTicket((prevSidebar) => ({
      ...prevSidebar,
      potencial_prize: ticket.bet_coins * sumOdds,
    }));
    if (count === 0) {
      setOpenTicket(false);
    }
  };
  const handleBetSubmit = async () => {
    let confirmation_check = true;

    if (match.estado_partido === "ENDED") {
      confirmation_check = false;
    }

    if (confirmation_check) {
      const ticket_status = "ON_GOING"; // ON_GOING | WINNER | LOOSER
      var bets_aux = bets;
      const aux_coins = ticket.bet_coins;
      const aux_ticket = ticket;
      aux_ticket.status = ticket_status;

      postTicket(aux_ticket);

      bets_aux.push(aux_ticket);
      setBets(bets_aux);

      await updateWallet(aux_coins);

      alert("APUESTA REALIZADA");

    } else {
      alert("Apuestas no válidas, por favor introdúzcalas nuevamente");
    }

    setTicket({ bets: [], bet_coins: 0, status: "", potencial_prize: 0.0 });
    setOpenTicket(false);
  };
  const postTicket = async (ticket) => {
    const ticket_response = await axios.post(
      `${getAPI_URL}/addTicket`,
      {
        competition: competition.ID,
        potencial_prize: ticket.potencial_prize,
        coins: ticket.bet_coins,
        status: ticket.status,
      }
    );
    const backend_id_ticket = ticket_response.data;
    console.log(backend_id_ticket);
    ticket.bets.forEach(async (bet) => {
      //POST BET
      await axios.post(`${getAPI_URL}/addBet`, {
        ticket_id: backend_id_ticket,
        match_id: bet.match_ID,
        choice: bet.choice,
        odd: bet.odd,
      });
    });
  }
  const updateWallet = async (coins) => {
    await axios.put(
      `${getAPI_URL}/setCompetitionCoins/${competition.ID}`,
      {
        value1: (competition.monedas - coins),
      }
    );
    setCompetition({ ...competition, monedas: competition.monedas - coins });
  }


  const openBetCard = () => {
    setBetCart(true);
  };
  const closeBetCard = () => {
    setBetCart(false);
  };

  async function handlePlayMatch() {
    const result = generateMatchResult(local.category, visitante.category);
    const marcador_local = result.local;
    const marcador_visitante = result.away;
    const estado_partido = "ENDED";
    try {
      await axios.put(
        `${getAPI_URL}/updateResultadoPartido/${id_match}`,
        {
          value1: marcador_local,
          value2: marcador_visitante,
          value3: estado_partido,
        }
      );

      //Local
      await axios.put(
        `${getAPI_URL}/updateEstadisticasEquipo/${local.name}/${match.id_group}`,
        {
          marcados: marcador_local,
          encajados: marcador_visitante,
          ganados: marcador_local > marcador_visitante ? 1 : 0,
          empatados: marcador_local === marcador_visitante ? 1 : 0,
          perdidos: marcador_local < marcador_visitante ? 1 : 0,
          puntos:
            marcador_local > marcador_visitante
              ? 3
              : marcador_local === marcador_visitante
                ? 1
                : 0,
        }
      );

      //Visitante
      await axios.put(
        `${getAPI_URL}/updateEstadisticasEquipo/${visitante.name}/${match.id_group}`,
        {
          marcados: marcador_visitante,
          encajados: marcador_local,
          ganados: marcador_local < marcador_visitante ? 1 : 0,
          empatados: marcador_local === marcador_visitante ? 1 : 0,
          perdidos: marcador_local > marcador_visitante ? 1 : 0,
          puntos:
            marcador_local < marcador_visitante
              ? 3
              : marcador_local === marcador_visitante
                ? 1
                : 0,
        }
      );

      fetchMatchInfo();
    } catch (error) {
      console.error('Error fetching match info:', error);
      setLoading(false);
      alert('Error fetching match info');
    }
  }

  useEffect(() => {
    fetchMatchInfo();
  }, []);

  return (
    <Layout>
      {loading && <p>Loading...</p>}
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <div>
        {match && (
          <div className="match-container">
            <div className="match-header">
              <div className="match-date">{match.fecha}</div>
              <div className="match-location">
                <p className="match-stadium">{match.stadium}</p> - {match.location}
              </div>
              <div className="match-status">{match.estado_partido}</div>
            </div>
            <div className="match-body">
              <div className="match-column">
                <p className="match-team"> {match.club_local}</p>
              </div>
              <div className="match-column">
                <div className="marcador-local">{match.marcador_local}</div>
                -
                <div className="marcador-visitante">{match.marcador_visitante}</div>
              </div>
              <div className="match-column">
                <p className="match-team">{match.club_visitante}</p>
              </div>

            </div>
            <div className="match-actions">
              1<button
                onClick={() => handleBet(match,
                  match.cuota_local,
                  "Local")}
                disabled={match.estado_partido === "ENDED"} >
                {match.cuota_local}
              </button>
              X<button
                onClick={() => handleBet(match,
                  match.cuota_empate,
                  "Draw")}
                disabled={match.estado_partido === "ENDED"} >
                {match.cuota_empate}
              </button>
              2<button
                onClick={() => handleBet(match,
                  match.cuota_visitante,
                  "Visitante")}
                disabled={match.estado_partido === "ENDED"} >
                {match.cuota_visitante}
              </button>
            </div>
            <div className="match-footer">
              <button
                onClick={() => handlePlayMatch()}
                disabled={match.estado_partido !== "READY_TO_PLAY"} >
                JUGAR PARTIDO
              </button>
            </div>
          </div>
        )}
        < div className="partido-amistoso">
          <div className="top-container">
            <div className="profile-bg-container">
              {user && (
                <div className="profil">
                  <h2 className="title">PERFIL</h2>
                  <div className="item">
                    <p className="big-text">{user?.nombre_usuario}</p>
                    <p className="regular-text">Nombre</p>
                  </div>
                  <div className="item">
                    <p className="big-text">{competition?.monedas}</p>
                    <p className="regular-text">Monedas</p>
                  </div>
                  <div className="item">
                    <p className="big-text">{bets.length}</p>
                    <p className="regular-text">Apuestas</p>
                  </div>
                  <button onClick={openBetCard}>Ver Apuestas</button>
                </div>
              )}
            </div>
            <div className="ticket-container">
              <h2>TICKET</h2>
              {openTicket ?
                (
                  <div>
                    <ul>
                      {Object.entries(ticket.bets).map(([index, obj]) => (
                        <li key={obj.bet_id} className="bet">
                          <hr></hr>
                          <p>
                            {match.club_local} - {match.club_visitante}
                          </p>
                          <p>
                            - Apuesta a {obj.choice}, cuota: {obj.odd}
                          </p>
                          <button onClick={() => handleDeleteBet(obj.bet_id)}>x</button>
                          <hr></hr>
                        </li>
                      ))}
                    </ul>
                    Cantidad apostada: {ticket.bet_coins}
                    <button onClick={handleBetIncrease}>+</button>
                    <button onClick={handleBetDecrease}>-</button>
                    <p>Ganancia potencial: {ticket.potencial_prize}</p>
                    <br></br>
                    <button onClick={handleBetSubmit} disabled={ticket.bet_coins <= 0}>
                      Realizar apuesta
                    </button>
                  </div>
                ) : (
                  <p>VACÍO</p>
                )}
            </div>
          </div>
        </div>
        {betCard && (
          <div className="popup">
            <div className="popup-inner">
              <div className="bets">
                {bets.map((bet, index) => (
                  <div key={index} className="bet">
                    <h2>TICKET</h2>
                    {bet.bets.map((singleBet, index) => (
                      <li>
                        <ul key={index}>Partido: {singleBet.match.club_local}  vs {singleBet.match.club_visitante}</ul>
                        <ul key={index}>Elección: {singleBet.choice}</ul>
                        <ul key={index}>Cuota: {singleBet.odd}</ul>
                      </li>
                    ))}

                    <p>Apostado: {bet.bet_coins}</p>
                    <p>Potencial Win: {bet.potencial_prize}</p>
                    <p>Result: {bet.status}</p>
                    <hr></hr>
                  </div>
                ))}
              </div>
              <button onClick={closeBetCard}>CERRAR</button>
            </div>
          </div>
        )}
        <button className="button-help" onClick={handleClickOpenHelp}>?</button>
      </div>
    </Layout>
  );
}
export default MatchInfo;
