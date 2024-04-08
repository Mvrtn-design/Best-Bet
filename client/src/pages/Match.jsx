import Layout from "./partials/Layout";
import Popup from "./partials/Popup";
import axios from "axios";
import { React, useEffect, useState } from "react";
import { MatchGenerator, getClubes } from "../routes/route_match";
import Help from "./partials/Help";

function Match() {
  const ESTADOS = {
    SIN_JUGAR: 0,
    EN_JUEGO: 1,
    TERMINADO: 2,
  };
  const [equipoVisitante, setEquipoVisitante] = useState([]);
  const [equipoLocal, setEquipoLocal] = useState([]);
  const [clubNames, setClubNames] = useState([]);
  const [partidoHTML, setPartidoHTML] = useState("");
  const [openHelp, setopenHelp] = useState(false);
  const [mostrarPartido, setMostrarPartido] = useState(false);
  const [partido, setPartido] = useState({});
  const [user, setUser] = useState({ nombre_usuario: "invitado", monedas: 99999 })
  // BETS
  const [ID_distributor, setID_distributor] = useState(0);
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

  function handleClickOpenHelp() {
    setopenHelp(!openHelp);
  }

  async function fetchClubes() {
    await axios
      .get("http://localhost:3001/getClubes")
      .then((result) => {
        setClubNames(result.data);
      })
      .catch((err) => {
        console.error("No va por: ", err);
      });
  }

  const ShowMatch = () => {

    if (equipoLocal.name === equipoVisitante.name || (!equipoLocal.name || !equipoVisitante.name)) {
      setPartidoHTML(<h2>ERROR AL ESCOGER LOS EQUIPOS</h2>);
    } else {
      const fecha = new Date().toDateString();
      const match_info = new MatchGenerator(equipoLocal, equipoVisitante, fecha);
      setPartido(match_info);
      setPartidoHTML(contenidoPartido(match_info));
    }
    setMostrarPartido(true);
  };

  const playMatch = () => {
    setPartidoHTML(partido.play());
  }

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
    console.log(partido);

    //check todos los partidos aun no están jugados
    if (partido.estado_partido !== "NOT_STARTED") {
      confirmation_check = false;
    }

    if (confirmation_check) {
      const ticket_status = "ON_GOING"; // ON_GOING | WINNER | LOOSER
      var bets_aux = bets;
      const aux_coins = ticket.bet_coins;
      const aux_ticket = ticket;
      aux_ticket.status = ticket_status;


      bets_aux.push(aux_ticket);
      setBets(bets_aux);

      setUser({ ...user, monedas: user.monedas - aux_coins });
      alert("APUESTA REALIZADA");
    } else {
      alert("Apuestas no válidas, por favor introdúzcalas nuevamente");
    }
    setTicket({ bets: [], bet_coins: 0, status: "", potencial_prize: 0.0 });
    setOpenTicket(false);
  };


  const openBetCard = () => {
    setBetCart(true);
  };
  const closeBetCard = () => {
    setBetCart(false);
  };

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
          console.log(bets[i].bets[j]);

          if (partido.status === "FINISHED") {
            let match_result = "";
            if (partido.localGoals > partido.awayGoals) {
              match_result = "Local";
            } else if (partido.localGoals < partido.awayGoals) {
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
            console.log(`apuesta ${i + 1} CONTINÚA AÚN`);
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

    setUser({
      ...user,
      monedas: user.monedas + cash_won,
    });
  };
  const contenidoPartido = (match_info) => {
    return (
      <div className="match-container">
        <div className="match-header">
          <div className="match-date">{match_info.date}</div>
          <div className="match-location">
            <p className="match-stadium">{match_info.stadium}</p> - {match_info.location}
          </div>
          <div className="match-status">{match_info.estado_partido}</div>
        </div>
        <div className="match-body">
          <div className="match-column">
            <p className="match-team"> {match_info.local.nombre}</p>
          </div>
          <div className="match-column">
            {match_info.local.marcador}-
            {match_info.visitante.marcador}
          </div>
          <div className="match-column">
            <p className="match-team">{match_info.visitante.nombre}</p>
          </div>

        </div>
        <div className="match-actions">
          1<button
            onClick={() => handleBet(match_info,
              match_info.cuota_local,
              "Local")}
            disabled={match_info.estado_partido !== "NOT_STARTED"} >
            {match_info.cuota_local}
          </button>
          X<button>{match_info.cuota_empate}</button>
          2<button>{match_info.cuota_visitante}</button>
        </div>
        <div className="match-footer">
          <button
            onClick={() => handlePlayMatch()}
            disabled={match_info.estado_partido !== "NOT_STARTED"}
          >
            JUGAR PARTIDO
          </button>
        </div>
      </div>

    )
  }


  useEffect(() => {
    fetchClubes();
  }, []);

  if (openHelp) {
    return (
      <Help trigger={openHelp} setTrigger={setopenHelp}>

        <h2 >Cuadro de ayuda para la página de inicio</h2>
        <p>Esta sección te ofrece información sobre cómo utilizar el sitio web.
          Si tienes alguna duda o inquietud no dudes en preguntarnos.       </p>
      </Help>)
  }
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
    <Layout>
      <div>
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
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
        {mostrarPartido ?
          (
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
                  {openTicket ?
                    (
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
              {partidoHTML}
            </div>
          ) : ('')}
        <button className="button-help" onClick={handleClickOpenHelp}>?</button>
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
                          - {obj.match.club_local} vs {obj.match.club_visitante}:{" "}
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
    </Layout >
  );
}

export default Match;
