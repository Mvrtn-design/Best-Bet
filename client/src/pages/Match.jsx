import Layout from "./partials/Layout";
import Popup from "./partials/Popup";
import axios from "axios";
import { React, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Help from "./partials/Help";
import { AuthContext } from "../helpers/AuthContext";
import { create_odds, generateMatchResult } from "../routes/Route_matches";
import { getHelpText } from "./partials/HelpTexts";
import { AiFillBackward } from "react-icons/ai";
import getAPI_URL from "../helpers/api_url";

function Match() {

  const [equipoVisitante, setEquipoVisitante] = useState([]);
  const [equipoLocal, setEquipoLocal] = useState([]);
  const [clubNames, setClubNames] = useState([]);
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
  const { authState } = useContext(AuthContext);

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
    const user_aux = authState.status ? authState.username : 'Invitado';
    setUser((userr) => ({ ...userr, nombre_usuario: user_aux }));
    await axios
      .get(`${getAPI_URL}/getClubes`)
      .then((result) => {
        setClubNames(result.data);
      })
      .catch((err) => {
        console.error("Error fetching clubs: ", err);
      });
  }

  const ShowMatch = () => {

    if (equipoLocal.name === equipoVisitante.name || (!equipoLocal.name || !equipoVisitante.name)) {
      alert("ERROR AL ESCOGER LOS EQUIPOS");
    } else {
      const odds = create_odds(equipoLocal.elo, equipoVisitante.elo);
      const newPartido = {
        visitante: equipoVisitante.name,
        marcador_visitante: null,
        local: equipoLocal.name,
        marcador_local: null,
        stadium: equipoLocal.stadium,
        location: equipoLocal.country,
        date: new Date().toDateString(),
        cuota_local: odds.local,
        cuota_empate: odds.draw,
        cuota_visitante: odds.away,
        estado_partido: 'NOT_STARTED',
        competicion: 'aaaamistoso',
      }
      setPartido(newPartido);
      setMostrarPartido(true);
    }
  };

  const handlePlayMatch = () => {
    const result = generateMatchResult(equipoLocal.category, equipoVisitante.category);
    const marcador__local = result.local;
    const marcador__visitante = result.away;
    const estado__partido = "FINALIZADO";
    setPartido((prevPartido) => ({
      ...prevPartido, marcador_local: marcador__local, marcador_visitante: marcador__visitante, estado_partido: estado__partido
    }));
  }

  const handleBet = (cuota, bet_choice) => {
    setID_distributor(ID_distributor + 1);

    const bet_aux = {
      bet_id: ID_distributor,
      choice: bet_choice,
      odd: cuota,
    };

    var bets_aux = ticket.bets;
    bets_aux.push(bet_aux);

    let sumOdds = 0.0;
    for (let i = 0; i < ticket.bets.length; i++) {
      sumOdds += ticket.bets[i].odd;
    }
    setTicket((prevSidebar) => ({
      ...prevSidebar,
      potencial_prize: ticket.bet_coins * sumOdds, bets: bets_aux
    }));

    if (!openTicket) {
      setOpenTicket(true);
    }
  };
  const handleBetIncrease = () => {
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
  const handleBetDecrease = () => {
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
    let bets_aux = ticket.bets.filter((x) => x.bet_id !== id);
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
        var estado_ticket = ""; //ESTADOS: ON_GOING, winner, looser

        //CHECKEO PARTIDO DEL TICKET
        for (
          let j = 0;
          j < bets[i].bets.length &&
          (estado_ticket === "" || estado_ticket === "winner");
          j++
        ) {
          console.log(bets[i].bets[j]);

          if (partido.status === "FINALIZADO") {
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

  useEffect(() => {
    fetchClubes();
  }, []);
  let navigate = useNavigate();
  if (openHelp) {
    return (
      <Help trigger={openHelp} setTrigger={setopenHelp}>
        {getHelpText("match")}
      </Help>)
  }
  if (openPopup) {
    return (
      <Popup trigger={openPopup} setTrigger={setopenPopup}>
        <h2>RESULTADOS DE APUESTAS</h2>
        <ul>
          <li>
            Ganadas: {notifications.apuestas_ganadas}
          </li>
          <li>
            Perdidas: {notifications.apuestas_perdidas}
          </li>
          <li>
            Sin finalizar: {notifications.apuestas_sin_finalizar}
          </li>
        </ul>
      </Popup>
    );
  }

  return (
    <Layout>
      <div>
        <button className="back-button" onClick={() => navigate(-1)}> <AiFillBackward /> Volver</button>
        <h1>PARTIDO AMISTOSO</h1>
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

        <button className="button-important" id="jugarPartido" onClick={ShowMatch}>
          VER PARTIDO
        </button>
        {mostrarPartido ?
          (<>
            <div className="match-container">
              <div className="match-header">
                <div className="match-date">{partido.date}</div>
                <div className="match-location">
                  <p className="match-stadium">{partido.stadium}</p> - {partido.location}
                </div>
                <div className="match-status">{partido.estado_partido}</div>
              </div>
              <div className="match-body">
                <div className="match-column">
                  <p className="match-team"> {partido.local}</p>
                </div>
                <div className="match-column">
                  <div className="marcador-local">{partido.marcador_local}</div>
                  -
                  <div className="marcador-visitante">{partido.marcador_visitante}</div>
                </div>
                <div className="match-column">
                  <p className="match-team">{partido.visitante}</p>
                </div>

              </div>
              <div className="match-actions">
                1<button
                  onClick={() => handleBet(partido.cuota_local, "Local")}
                  disabled={partido.estado_partido !== "NOT_STARTED"} >
                  {partido.cuota_local}
                </button>
                X<button onClick={() => handleBet(partido.cuota_empate, "Draw")}
                  disabled={partido.estado_partido !== "NOT_STARTED"} >
                  {partido.cuota_empate}
                </button>
                2<button onClick={() => handleBet(partido.cuota_visitante, "Visitante")}
                  disabled={partido.estado_partido !== "NOT_STARTED"} >
                  {partido.cuota_visitante}
                </button>
              </div>
              <div className="match-footer">
                <button
                  className="button-important"
                  onClick={() => handlePlayMatch()}
                  disabled={partido.estado_partido !== "NOT_STARTED"} >
                  JUGAR PARTIDO
                </button>
              </div>
            </div>
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
                        <p className="big-text">{bets.length}</p>
                        <p className="regular-text">Apuestas</p>
                      </div>
                      <button className="button-important" onClick={openBetCard}>Ver Apuestas</button>
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
                                {partido.local} - {partido.visitante}
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
                        <button className="button-important" onClick={handleBetSubmit} disabled={ticket.bet_coins <= 0}>
                          Realizar apuesta
                        </button>
                      </div>
                    ) : (
                      <p>VACÍO</p>
                    )}
                </div>
              </div>
            </div>
          </>
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
                        <ul>
                          <li>
                            <strong>{partido.local} vs {partido.visitante}</strong>: {obj.odd} for {obj.choice}
                          </li>
                        </ul>
                      </div>
                    ))}
                    <p><strong>Apostado :</strong> {bet.bet_coins}</p>
                    <p><strong>Ganancia potencial :</strong> {bet.potencial_prize}</p>
                    <p><strong>Estado ticket : </strong>{bet.status}</p>
                    <hr></hr>
                  </div>
                ))}
              </div>
              <button className="button-important" onClick={checkBetResults}>COMPROBAR APUESTAS</button>
              <button onClick={closeBetCard}>CERRAR</button>
            </div>
          </div>
        )}
      </div>
    </Layout >
  );
}

export default Match;