import React, { useState } from "react";
import Popup from "./partials/Popup";
import "../Appp.css";

//TODO: ver como salir de una funcion por la mitad o antes de terminarla.

const Tempp = () => {
  const [ID_distributor, setID_distributor] = useState(0);
  const [profile, setProfile] = useState({ name: "John", coins: 100 });
  const [openPopup, setopenPopup] = useState(false);
  const [openTicket, setOpenTicket] = useState(false);
  const [betCard, setBetCart] = useState(false);
  const [bets, setBets] = useState([]);
  const [notifications, setNotificaction] = useState({
    apuestas_ganadas: 0,
    apuestas_perdidas: 0,
    apuestas_sin_finalizar: 0,
  });
  const [ticket, setTicket] = useState({
    bets: [],
    bet_coins: 0,
    status: "",
    potencial_prize: 0.0,
  });

  const [matches, setMatches] = useState([
    {
      id: 1,
      localTeam: "Team A",
      localGoals: null,
      awayTeam: "Team B",
      awayGoals: null,
      odds: { local: 2.1, draw: 3, away: 2 },
      status: "TO_START",
    },
    {
      id: 2,
      localTeam: "Team C",
      localGoals: null,
      awayTeam: "Team D",
      awayGoals: null,
      odds: { local: 1.5, draw: 3, away: 2.5 },
      status: "TO_START",
    },
    {
      id: 3,
      localTeam: "UUUUUUUUUUUUC",
      localGoals: null,
      awayTeam: "bjvjhvhv D",
      awayGoals: null,
      odds: { local: 1.5, draw: 3, away: 2.5 },
      status: "TO_START",
    },
    {
      id: 4,
      localTeam: "TTTTTTCCCCC",
      localGoals: null,
      awayTeam: "T  u  u  i  D",
      awayGoals: null,
      odds: { local: 1.5, draw: 3, away: 2.5 },
      status: "TO_START",
    },
    {
      id: 5,
      localTeam: "Team Q",
      localGoals: null,
      awayTeam: "Team W",
      awayGoals: null,
      odds: { local: 1.5, draw: 3, away: 2.5 },
      status: "TO_START",
    },
    {
      id: 6,
      localTeam: "Team E",
      localGoals: null,
      awayTeam: "Team R",
      awayGoals: null,
      odds: { local: 1.5, draw: 3, away: 2.5 },
      status: "TO_START",
    },
    {
      id: 7,
      localTeam: "Team T",
      localGoals: null,
      awayTeam: "Team U",
      awayGoals: null,
      odds: { local: 1.5, draw: 3, away: 2.5 },
      status: "TO_START",
    },
    {
      id: 8,
      localTeam: "Team S",
      localGoals: null,
      awayTeam: "Team F",
      awayGoals: null,
      odds: { local: 1.5, draw: 3, away: 2.5 },
      status: "TO_START",
    },
  ]);

  const findMatchById = (id) =>
    matches.find((match) => match.id === id) || null;

  ///////////////     METER PARTIDO AL TICKET
  const handleBet = async (matchId, odd, bet_choice) => {
    const match = findMatchById(matchId);
    const bet_aux = {
      bet_id: ID_distributor,
      match: match,
      match_ID: matchId,
      choice: bet_choice,
      odd: odd,
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

  ////////    CREAR APUESTA

  const handleBetSubmit = () => {
    let confirmation_check = true;

    //check todos los partidos aun no están jugados
    for (let i = 0; i < ticket.bets.length && confirmation_check === true; i++) {
      const partidoo = findMatchById(ticket.bets[i].match_ID);
      console.log(partidoo);
      if (findMatchById(ticket.bets[i].match_ID).status !== "TO_START") {
        confirmation_check = false;
      }
    }

    if (confirmation_check) {
      const ticket_status = "ON_GOING"; // ON_GOING | WINNER | LOOSER
      var bets_aux = bets;
      const aux_coins = ticket.bet_coins;
      const aux_ticket = ticket;
      aux_ticket.status = ticket_status;

      bets_aux.push(aux_ticket);
      setBets(bets_aux);

      setProfile({ ...profile, coins: profile.coins - aux_coins });
      alert("APUESTA REALIZADA");
    } else {
      alert("Apuestas no válidas, por favor introduzcalas nuevamente");
    }

    setTicket({ bets: [], bet_coins: 0, status: "", potencial_prize: 0.0 });
    setOpenTicket(false);
  };

  /////////  SUMAR Y QUITAR DINERO
  const handleBetIncrease = async () => {
    if (profile.coins > 0) {
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

  /////////   SIMULAR PARTIDOS
  const handleSimulateMatch = (matchId) => {
    setMatches(
      matches.map((match) =>
        match.id === matchId
          ? {
            ...match,
            awayGoals: Math.floor(Math.random() * 5),
            localGoals: Math.floor(Math.random() * 5),
            status: "FINISHED",
          }
          : match
      )
    );
  };

  //////////    QUITAR PARTIDO DEL TICKET
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

  const openBetCard = () => {
    setBetCart(true);
  };
  const closeBetCard = () => {
    setBetCart(false);
  };

  ////////    COMPROBAR RESULTADOS
  const checkBetResults = () => {
    const temp_notification = {
      apuestas_ganadas: 0,
      apuestas_perdidas: 0,
      apuestas_sin_finalizar: 0,
    };
    let cash_won = 0;
    //CHECKEO TICKET
    for (let i = 0; i < bets.length; i++) {
      console.log("ticket: ", bets[i]);

      if (bets[i].status === "ON_GOING") {
        var estado_ticket = ""; //ESTADOS: ON_GOING, winner, looser, on_going

        //CHECKEO PARTIDO DEL TICKET
        for (
          let j = 0;
          j < bets[i].bets.length &&
          (estado_ticket == "" || estado_ticket == "winner");
          j++
        ) {
          const match_aux = findMatchById(bets[i].bets[j].match_ID);
          console.log("partido apostado: ", match_aux);

          if (match_aux.status === "FINISHED") {
            let match_result = "";
            if (match_aux.localGoals > match_aux.awayGoals) {
              match_result = "Local";
            } else if (match_aux.localGoals < match_aux.awayGoals) {
              match_result = "Away";
            } else {
              match_result = "Draw";
            }
            const decition = bets[i].bets[j].choice;
            console.log(`digo: ${decition} y fue: ${match_result}`);

            //PARTIDO ACERTADO

            if (decition === match_result) {
              estado_ticket = "winner";
              console.log(`Match ${j + 1} acertado`);
            } else {
              //PARTIDO FALLADO
              estado_ticket = "looser";
              console.log(`Match ${j + 1} fallado`);
            }
          } else {
            estado_ticket = "ON_GOING";
            console.log(`Match ${j + 1} not finished`);
          }
        }
        console.log("estado: ", estado_ticket);
        //ACTUALIZAR TICKET
        switch (estado_ticket) {
          case "winner":
            console.log(`apuesta ${i + 1} ganada`);
            temp_notification.apuestas_ganadas++;
            cash_won += bets[i].potencial_prize;
            break;
          case "looser":
            temp_notification.apuestas_perdidas++;
            console.log(`apuesta ${i + 1} perdida`);
            break;
          case "ON_GOING":
            temp_notification.apuestas_sin_finalizar++;
            console.log(`apuesta ${i + 1} CONTNUA AUN`);
            break;

          default:
            console.error("Error al obtener el estado del ticket");
            break;
        }
      }
    }

    setNotificaction((prevNotifications) => ({
      ...prevNotifications,
      apuestas_sin_finalizar: temp_notification.apuestas_sin_finalizar,
      apuestas_ganadas: temp_notification.apuestas_ganadas,
      apuestas_perdidas: temp_notification.apuestas_perdidas,
    }));
    setopenPopup(true);

    setProfile({
      ...profile,
      coins: profile.coins + cash_won,
    });
  };

  if (openPopup) {
    return (
      <Popup trigger={openPopup} setTrigger={setopenPopup}>
        <p>- Ganadas: {notifications.apuestas_ganadas} </p>
        <p>- Perdidas: {notifications.apuestas_perdidas}</p>
        <p>- Sin finalizar: {notifications.apuestas_sin_finalizar} </p>
      </Popup>
    );
  }

  return (
    <div className="App">
      <header className="header">BEST BET</header>
      <div className="top-container">

        <div className="profile">
          <h2>PROFILE </h2>
          <p>Nombre: {profile.name}</p>
        </div>

        <div className="wallet">
          <h2>WALLET</h2>
          <p>Coins: {profile.coins}</p>
          <p>Bets</p>
          <button onClick={openBetCard}>Ver Apuestas</button>
          {betCard && (
            <div className="popup">
              <div className="popup-inner">
                <div className="bets">
                  {bets.map((bet, index) => (
                    <div key={index} className="bet">
                      <h2>TICKET {index + 1} </h2>

                      {Object.entries(bet.bets).map(([indexx, obj]) => (
                        <div key={indexx}>
                          <p>
                            - {obj.match.localTeam} vs {obj.match.awayTeam}:{" "}
                            {obj.odd} for {obj.choice}{" "}
                          </p>
                        </div>
                      ))}

                      <p>Apostado: {bet.bet_coins}</p>
                      <p>Potencial Win: {bet.potencial_prize}</p>
                      <p>Result: {bet.status}</p>
                      <hr></hr>
                    </div>
                  ))}
                </div>
                <button onClick={checkBetResults}>CHECK BET RESULTS</button>
                <button onClick={closeBetCard}>CERRAR</button>
              </div>
            </div>
          )}
        </div>
        <div className="ticket">
          <h2>Ticket</h2>
          {openTicket && (
            <div>           
              <p>Revisar apuestas</p>
              <ul>
                {Object.entries(ticket.bets).map(([index, obj]) => (
                  <li key={obj.bet_id}>
                    <p>
                      {obj.match.localTeam} - {obj.match.awayTeam}
                    </p>
                    <p>
                      - {obj.bet_id}: Apuesta a {obj.choice} , cuota: {obj.odd}
                    </p>
                    <button onClick={() => handleDeleteBet(obj.bet_id)}>x</button>
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
          )}
        </div>
      </div>
      <hr></hr>
      <div className="matches">
        {matches.map((match) => (
          <div key={match.id} className="match">
            <p>
              {match.localTeam} vs {match.awayTeam}
            </p>
            <button
              onClick={() => handleBet(match.id, match.odds.local, "Local")}
              disabled={match.status !== "TO_START"}
            >
              Bet Local - {match.odds.local}
            </button>
            <button
              onClick={() => handleBet(match.id, match.odds.draw, "Draw")}
              disabled={match.status !== "TO_START"}
            >
              Bet Draw - {match.odds.draw}
            </button>
            <button
              onClick={() => handleBet(match.id, match.odds.away, "Away")}
              disabled={match.status !== "TO_START"}
            >
              Bet Away - {match.odds.away}
            </button>
            {match.status !== "TO_START" && (
              <p>
                RESULT: {match.localGoals} - {match.awayGoals}
              </p>
            )}
            {match.status === "TO_START" && (
              <button onClick={() => handleSimulateMatch(match.id)}>
                Simulate Match
              </button>
            )}
          </div>
        ))}
      </div>
      <footer className="footer">PIE DE PAGINA</footer>

    </div>
  );
};
export default Tempp;
