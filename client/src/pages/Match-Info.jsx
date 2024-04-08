import React from "react";
import Layout from "./partials/Layout";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import MatchGenerator from "../routes/route_match";
import { useNavigate } from "react-router-dom";

function Match_Info() {
  const [ID_distributor, setID_distributor] = useState(0);
  const [match, setMatch] = useState(null);
  const [matchTemp, setMatchTemp] = useState(null);
  const [betCard, setBetCart] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openTicket, setOpenTicket] = useState(false);
  const location = useLocation();
  const [posibilties, setPosibilities] = useState([
    { name: "local", price: 0 },
    { name: "draw", price: 0 },
    { name: "away", price: 0 },
  ]);
  const [ticket, setTicket] = useState({
    bets: [],
    bet_coins: 0,
    status: "",
    potencial_prize: 0.0,
  });

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

  let navigate = useNavigate();

  const fetchMatchInfo = async () => {
    console.log("GETTING INFO");
    try {
      setLoading(true);
      setUser(usuario);
      const response = await axios.get(
        `http://localhost:3001/getPartidoById/${id_match}`
      );
      const match_info = await response.data[0];
      console.log(match_info);

      setMatch(match_info);
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
  function handleClickOpenHelp() {
    setopenHelp(!openHelp);
  }
  ////////////////////////////            APUESTAS           ///////////////////////////////////////////
  const handleCancel = () => {
    setBetState(initialState);
  };
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
    if (user.monedas > 0) {
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

    //check todos los partidos aun no están jugados
    for (let i = 0; i < ticket.bets.length && confirmation_check === true; i++) {
      if (findMatchById(ticket.bets[i].match_ID).estado_partido !== "NOT_STARTED") {
        confirmation_check = false;
      }
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
    const competition_response = await axios.get(
      `http://localhost:3001/getCompeticionByPartida/${idPartida}`
    );
    const ticket_response = await axios.post(
      "http://localhost:3001/addTicket",
      {
        competition: competition_response.data[0].ID,
        potencial_prize: ticket.potencial_prize,
        coins: ticket.bet_coins,
        status: ticket.status,
      }
    );
    const backend_id_ticket = ticket_response.data;
    console.log(backend_id_ticket);
    ticket.bets.forEach(async (bet) => {
      //POST BET
      await axios.post("http://localhost:3001/addBet", {
        ticket_id: backend_id_ticket,
        match_id: bet.match_ID,
        choice: bet.choice,
        odd: bet.odd,
      });
    });
  }
  const updateWallet = async (coins) => {
    await axios.put(
      `http://localhost:3001/setUserCoins/${user.ID}`,
      {
        value1: (user.monedas - coins),
      }
    );
    setUser({ ...user, monedas: user.monedas - coins });
  }

  const openBetCard = () => {
    setBetCart(true);
  };
  const closeBetCard = () => {
    setBetCart(false);
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
      <div className="match-info">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
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
                  <p className="big-text">{user?.monedas}</p>
                  <p className="regular-text">Monedas</p>
                </div>
                <div className="item">
                  <p className="big-text">0</p>
                  <p className="regular-text">Apuestas</p>
                </div>
                <button onClick={openBetCard}>Ver Apuestas</button>
              </div>
            )}
          </div>
          <div className="ticket-container">
            <h2>TICKET</h2>
            {openTicket ? (
              <div>
                <ul>
                  {Object.entries(ticket.bets).map(([index, obj]) => (
                    <li key={obj.bet_id} className="bet">
                      <hr></hr>
                      <p>
                        {obj.match.club_local} - {obj.match.club_visitante}
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
        {match && (
          <div className="match-container">
            <div className="match-header">
              <div className="match-date">{match.fecha.split(".")[0]}</div>
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
                {match.marcador_local}-
                {match.marcador_visitante}
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
                disabled={match.estado_partido !== "NOT_STARTED"} >
                {match.cuota_local}
              </button>
              X:<button>{match.cuota_empate}</button>
              2:<button>{match.cuota_visitante}</button>
            </div>
            <div className="match-footer">
              <button
                onClick={() => handlePlayMatch()}
                disabled={loading || match.estado_partido !== "READY_TO_PLAY"}
              >
                JUGAR PARTIDO
              </button>
            </div>
          </div>
        )}
      </div>
      <button className="button-help" onClick={handleClickOpenHelp}>?</button>
    </Layout>
  );
}
export default Match_Info;
