import { useState } from "react";

export function getInfoEquipos(equipos) {
  return (
    <div>
      <h2>Equipos: </h2>
      {equipos.map((team, index) => (
        <div key={`${team.id}-${index}`}>
          <li className="list-teams">
           <ul className="list-team">{team.name}, {team.country}</ul> 
          </li>
        </div>
      ))}
    </div>);
}

export function GetInformacionPrincipal(usuario, bettts, competicion, tickett) {
  const [betCard, setBetCart] = useState(false);
  const [openTicket, setOpenTicket] = useState(false);
  const [ticket, setTicket] = useState(tickett);

  const openBetCard = () => {
    setBetCart(true);
  };
  const closeBetCard = () => {
    setBetCart(false);
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
  const handleBetIncrease = async () => {
    if (usuario.monedas > 0) {
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
  const checkBetResults = () => {
    const temp_notification = {
      apuestas_ganadas: 0,
      apuestas_perdidas: 0,
      apuestas_sin_finalizar: 0,
    };
    let cash_won = 0;
    //CHECKEO TICKET
    for (let i = 0; i < bettts.length; i++) {
      console.log("ticket: ", bettts[i]);

      if (bettts[i].status === "ON_GOING") {
        var estado_ticket = ""; //ESTADOS: ON_GOING, winner, looser, on_going

        //CHECKEO PARTIDO DEL TICKET
        for (
          let j = 0;
          j < bettts[i].bets.length &&
          (estado_ticket === "" || estado_ticket === "winner");
          j++
        ) {
          console.log(bettts[i].bets[j]);
          const match_aux = 0 //findMatchById(bets[i].bets[j].match.Idd);
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
            const decition = bettts[i].bets[j].choice;
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
            cash_won += bettts[i].potencial_prize;
            break;
          case "looser":
            temp_notification.apuestas_perdidas++;
            console.log(`apuesta ${i + 1} perdida`);
            break;
          case "ON_GOING":
            temp_notification.apuestas_sin_finalizar++;
            console.log(`apuesta ${i + 1} CONTINÚA AÚN`);
            break;

          default:
            console.error("Error al obtener el estado del ticket");
            break;
        }
      }
    }

    // setNotificaction((prevNotifications) => ({
    //   ...prevNotifications,
    //   apuestas_sin_finalizar: temp_notification.apuestas_sin_finalizar,
    //   apuestas_ganadas: temp_notification.apuestas_ganadas,
    //   apuestas_perdidas: temp_notification.apuestas_perdidas,
    // }));
    // setopenPopup(true);

    // setUser({
    //   ...user,
    //   monedas: user.monedas + cash_won,
    // });
  };
  return (
    <div className="top-container">
      <div className="profile-container">
        {usuario && (
          <div className="profil">
            <h2 className="title">PERFIL</h2>
            <div className="item">
              <p className="big-text">{usuario?.nombre_usuario}</p>
              <p className="regular-text">Nombre</p>
            </div>
            <div className="item">
              <p className="big-text">{bettts.length}</p>
              <p className="regular-text">Apuestas</p>
            </div>
          </div>
        )}
      </div>
      <div className="date-container">
        {competicion && (
          <div>
            <div className="item">
              <p className="big-text">{competicion?.temporada}</p>
              <p className="regular-text">Temporada</p>
            </div>
            <div className="item">
              <p className="big-text">{competicion?.estado}</p>
              <p className="regular-text">Estado Actual</p>
            </div>
            <div className="item">
              <p className="big-text">{competicion?.monedas}</p>
              <p className="regular-text">Monedas</p>
            </div>
            <div className="item">
              <p className="big-text">{competicion?.dia.split("T")[0]}</p>
              <p className="regular-text">Día</p>
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
            <button
            // onClick={handleBetSubmit} disabled={ticket.bet_coins <= 0}
            >
              Realizar apuesta
            </button>
          </div>
        ) : (
          <p>VACÍO</p>
        )}
      </div>

      {betCard && (
        <div className="popup">
          <div className="popup-inner">
            <div className="bets">
              {bettts.map((bet, index) => (
                <div key={index} className="bet">
                  <h2>TICKET </h2>
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
            <button onClick={checkBetResults}>CHECK BET RESULTS</button>
            <button onClick={closeBetCard}>CERRAR</button>
          </div>
        </div>
      )}
    </div>
  )
}


export default { getInfoEquipos, GetInformacionPrincipal };
