import { React, useEffect, useState } from "react";
import Popup from "./partials/Popup";
import Layout from "./partials/Layout";
import Help from "./partials/Help";
import { useParams, useNavigate } from "react-router-dom";
import { create_odds, generateMatchResult } from "../routes/Route_matches";
import { getInfoEquipos } from "../routes/route_competicion";
import axios from "axios";

const Inicio = () => {
  const competition_statuses = [
    "1.CREADO",
    "2.GROUPED",
    "3.MATCHED",
    "4.ROUND_OF_16",
    "5.ROUND_OF_16-GROUPED",
    "6.ROUND_OF_16-MATCHED",
    "7.ROUND_OF_8",
    "8.ROUND_OF_8_GROUPED",
    "9.ROUND_OF_8-MATCHED",
    "10.SEMIFINALS",
    "11.SEMIFINALS-GROUPED",
    "12.SEMIFINALS-MATCHED",
    "13.FINAL",
    "14.FINAL-GROUPED",
    "15.FINAL-MATCHED",
    "16.ENDED",
  ];
  const competition_rounds = [
    "Group_state",
    "Round_of_16",
    "Round_of_8",
    "Semifinals",
    "Final",
    "Champion",
  ];
  const teamsByCountry = {
    spain: 4,
    england: 4,
    germany: 4,
    italy: 3,
    france: 3,
    portugal: 2,
    turkey: 2,
  };
  const navigate = useNavigate();
  const { idPartida } = useParams();
  const [active, setActive] = useState(-1);
  const [competition, setCompetition] = useState(null);
  const [teams, setTeams] = useState({
    Group_state: [],
    Round_of_16: [],
    Round_of_8: [],
    Semifinals: [],
    Final: [],
    Champion: [],
  });
  const [user, setUser] = useState({
    ID: 0,
    nombre_usuario: 0,
  });
  const [matches, setMatches] = useState({
    Group_state: [],
    Round_of_16: [],
    Round_of_8: [],
    Semifinals: [],
    Final: [],
    Champion: [],
  });
  const [groups, setGroups] = useState({
    Group_state: {},
    Round_of_16: {},
    Round_of_8: {},
    Semifinals: {},
    Final: {},
  });

  // BETS
  const [ID_distributor, setID_distributor] = useState(0);
  const [openTicket, setOpenTicket] = useState(false);
  const [openPopup, setopenPopup] = useState(false);
  const [openHelp, setopenHelp] = useState(false);
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

  //// CURRENT STATE

  let temporada_actual = "2023";
  const [currentSection, setCurrentSection] = useState(competition_statuses[0]);
  const [loading, setLoading] = useState(false);
  const [aux_loading, setAuxLoading] = useState(true);
  const [IdMatchesReadyToPlay, setIdMatchesReadyToPlay] = useState([]);
  const fechas = {
    octavos: new Date(`${temporada_actual}-11-23T00:00:00`)
      .toISOString()
      .slice(0, 24),
    cuartos: new Date("2024-01-05T00:00:00").toISOString().slice(0, 24),
    Semifinales: new Date("2024-01-20T00:00:00").toISOString().slice(0, 24),
    final: new Date("2024-02-10T00:00:00").toISOString().slice(0, 24),
    Champion: new Date("2024-03-01T00:00:00").toISOString().slice(0, 24),
  };

  ////////              FUNCTIONS         ////////////
  async function fetchCompetitionInfo() {
    console.log("GETTING COMPETITION INFO");
    if (loading === false) {
      setAuxLoading(true);
    }
    try {
      const user_backend_data = await axios.get(
        `http://localhost:3001/getUSerByPartida/${idPartida}`,
        { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } }
      );
      const competition_response = await axios.get(
        `http://localhost:3001/getCompeticionByPartida/${idPartida}`
      );
      if (user_backend_data.data.error) {
        alert(user_backend_data.data.error);
        console.error(user_backend_data.error);
        navigate("/");
      } else {
        const Competition_data = competition_response.data[0];
        temporada_actual = competition_response.data[0].temporada.split("-")[0];
        setCompetition({
          ID: competition_response.data[0].ID,
          temporada: competition_response.data[0].temporada,
          estado: competition_response.data[0].estado,
          dia: competition_response.data[0].dia,
          monedas: competition_response.data[0].monedas,
          nombre: competition_response.data[0].nombre,
        });

        setUser({
          ID: user_backend_data.data[0].id,
          nombre_usuario: user_backend_data.data[0].nombre_usuario,
        });

        ////////////////////////////////////////////////
        ///     SEGÚN ESTADO DE LA COMPETICIÓN      ////
        ////////////////////////////////////////////////
        /// GRUPOS
        if (Competition_data.estado.split(".")[0] <= 1) {
          //meter clubes
          await fetchTeams();
        } else if (Competition_data.estado.split(".")[0] > 1) {
          fetchGroups(Competition_data.ID, competition_rounds[0].toUpperCase());
        }
        if (Competition_data.estado.split(".")[0] > 2) {
          await fetchMathes(Competition_data.ID, competition_rounds[0].toUpperCase());

          if (fechas.octavos.split("T")[0] === competition_response.data[0].dia.split("T")[0]) {
            await updateCompetitionState(competition_statuses[3]);
            await handleAdvance();
          }
        }
        
        /// OCTAVOS
        if (Competition_data.estado.split(".")[0] > 3) {
          console.log("fechas: ", fechas.octavos.split("T")[0], competition_response.data[0].dia.split("T")[0]);    
          const equipos_de_octavos = await fetchOctavosFinal();
          setTeams((prevDict) => ({ ...prevDict, Round_of_16: equipos_de_octavos }));
          if (Competition_data.estado.split(".")[0] > 4) {
            fetchGroups(Competition_data.ID, competition_rounds[1].toUpperCase());
            fetchMathes(Competition_data.ID, competition_rounds[1].toUpperCase());
            if (Competition_data.estado.split(".")[0] > 5) {
              if (fechas.cuartos.split("T")[0] === competition.dia.split("T")[0]) {
                await updateCompetitionState(competition_statuses[6]);
                await handleAdvance();
              }
              //////  CUARTOS
              if (Competition_data.estado.split(".")[0] > 6) {
                const oct = await fetchClasificados(competition_rounds[1]);
                setTeams((prevDict) => ({ ...prevDict, Round_of_8: oct }));
                if (Competition_data.estado.split(".")[0] > 7) {
                  fetchGroups(Competition_data.ID, competition_rounds[2].toUpperCase());
                  fetchMathes(Competition_data.ID, competition_rounds[2].toUpperCase());
                  if (Competition_data.estado.split(".")[0] > 8) {
                    if (fechas.Semifinales.split("T")[0] === competition.dia.split("T")[0]) {
                      await updateCompetitionState(competition_statuses[9]);
                      await handleAdvance();
                    }
                    /// SEMIFINALES
                    if (Competition_data.estado.split(".")[0] > 9) {
                      const semis = await fetchClasificados(competition_rounds[2]);
                      setTeams((prevDict) => ({ ...prevDict, Semifinals: semis }));
                      if (Competition_data.estado.split(".")[0] > 10) {
                        fetchGroups(Competition_data.ID, competition_rounds[3].toUpperCase());
                        fetchMathes(Competition_data.ID, competition_rounds[3].toUpperCase());
                        if (Competition_data.estado.split(".")[0] > 11) {
                          if (fechas.final.split("T")[0] === competition.dia.split("T")[0]) {
                            await updateCompetitionState(competition_statuses[12]);
                            await handleAdvance();
                          }
                          //// FINAL
                          if (Competition_data.estado.split(".")[0] > 12) {
                            const semis = await fetchClasificados(competition_rounds[3]);
                            setTeams((prevDict) => ({ ...prevDict, Final: semis }));
                            if (Competition_data.estado.split(".")[0] > 13) {
                              fetchGroups(Competition_data.ID, competition_rounds[4].toUpperCase());
                              fetchMathes(Competition_data.ID, competition_rounds[4].toUpperCase());
                              if (Competition_data.estado.split(".")[0] > 14) {

                                if (fechas.Champion.split("T")[0] === competition.dia.split("T")[0]) {
                                  await updateCompetitionState(competition_statuses[15]);
                                  await handleAdvance();
                                }
                                //////// CHAMPION
                                if (Competition_data.estado.split(".")[0] > 15) {
                                  const semis = await fetchClasificados(competition_rounds[4]);
                                  setTeams((prevDict) => ({ ...prevDict, Champion: semis }));
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        await fetchPartidosDisponibles(Competition_data.ID);
        fetchBets(competition_response.data[0].ID);
        setAuxLoading(false);
      }
    } catch (error) {
      console.error("Error fetching competition info: ", error);
      setAuxLoading(false);
    }
  }
  useEffect(() => {
    fetchCompetitionInfo();
  }, [aux_loading]);



  const fetchTeams = async () => {
    try {
      const teamss = [];
      for (let country in teamsByCountry) {
        const response = await axios.get(
          "http://localhost:3001/getClubsByCountry",
          { params: { value1: country, value2: teamsByCountry[country] } }
        );
        teamss.push(...response.data);
      }
      const response = await axios.get("http://localhost:3001/getOtherClubs", {
        params: { value1: Object.keys(teamsByCountry), value2: 10 },
      });
      teamss.push(...response.data);
      setTeams({ Group_state: teamss.sort((a, b) => a.category - b.category) });
    } catch (error) {
      console.warn("Error fetching teams: ", error);
    }
  };

  function groupByLetra(equipos) {
    return equipos.reduce((grupos, item) => {
      const groupName = [item.id_grupo, item.letra];

      if (!grupos[groupName]) {
        grupos[groupName] = [];
      }

      grupos[groupName].push(item);
      return grupos;
    }, {});
  }

  function groupByJornada(partidos) {
    const result = [];
    const chunkSize = Math.ceil(partidos.length / 6);

    for (let i = 0; i < partidos.length; i += chunkSize) {
      const chunk = partidos.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
  }
  function groupTickets(allBets) {
    return allBets.reduce((tickets, item) => {
      const ticketName = [item.id_ticket];

      if (!tickets[ticketName]) {
        tickets[ticketName] = [];
      }

      tickets[ticketName].push(item);
      return tickets;
    }, {});

  }

  const fetchOctavosFinal = async () => {
    var equipos = [];
    for (let i in groups.Group_state) {
      const temp_grupo = i.split(",")[0];
      const response = await axios.get(
        `http://localhost:3001/getGrupoById/${temp_grupo}`
      );
      equipos.push(response.data[0]);
      equipos.push(response.data[1]);
    }
    return equipos;
  };
  const fetchClasificados = async (ronda) => {
    var round_teams = {};
    switch (ronda) {
      case competition_rounds[0]:
        round_teams = groups.Group_state;
        break;
      case competition_rounds[1]:
        round_teams = groups.Round_of_16;
        break;
      case competition_rounds[2]:
        round_teams = groups.Round_of_8;
        break;
      case competition_rounds[3]:
        round_teams = groups.Semifinals;
        break;
      case competition_rounds[4]:
        round_teams = groups.Final;
        break;

      default:
        console.error(
          "Número de equipos a agrupar erroneo: ",
          ronda,
          competition_statuses[6]
        );
        break;
    }

    var equipos = [];
    for (let i in round_teams) {
      const temp_grupo = i.split(",")[0];
      const response = await axios.get(
        `http://localhost:3001/getGrupoById/${temp_grupo}`
      );
      equipos.push(response.data[0]);
    }
    return equipos;
  };


  const fetchPartidosDisponibles = async (id_competicion) => {
    try {
      const avaliables = await axios.get(
        `http://localhost:3001/checkPartidosDisponibles/${id_competicion}`
      );
      setIdMatchesReadyToPlay(avaliables.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGroups = async (id_competicion, round) => {
    try {
      const teamsResponse = await axios.get(
        "http://localhost:3001/getGroupsByCompetition",
        {
          params: {
            value1: id_competicion,
            value2: round,
          },
        }
      );

      switch (round) {
        case competition_rounds[0].toUpperCase():
          setTeams((prevDict) => ({
            ...prevDict,
            Group_state: teamsResponse.data,
          }));
          setGroups((prevDict) => ({
            ...prevDict,
            Group_state: groupByLetra(teamsResponse.data),
          }));
          break;
        case competition_rounds[1].toUpperCase():
          setGroups((prevDict) => ({
            ...prevDict,
            Round_of_16: groupByLetra(teamsResponse.data),
          }));
          break;
        case competition_rounds[2].toUpperCase():
          setGroups((prevDict) => ({
            ...prevDict,
            Round_of_8: groupByLetra(teamsResponse.data),
          }));
          break;
        case competition_rounds[3].toUpperCase():
          setGroups((prevDict) => ({
            ...prevDict,
            Semifinals: groupByLetra(teamsResponse.data),
          }));
          break;
        case competition_rounds[4].toUpperCase():
          setGroups((prevDict) => ({
            ...prevDict,
            Final: groupByLetra(teamsResponse.data),
          }));
          break;

        default:
          console.error("Numero de equipos a agrupar erroneo");
          break;
      }
    } catch (error) {
      console.error("Error recuperando los grupos:", error);
    }
  };

  if (openHelp) {
    return (
      <Help trigger={openHelp} setTrigger={setopenHelp}>

        <h2 >Cuadro de ayuda para la página de inicio</h2>
        <p>Esta sección te ofrece información sobre cómo utilizar el sitio web.
          Si tienes alguna duda o inquietud no dudes en preguntarnos.       </p>
        <div style={{ backgroundColor: `red` }} className="my-div" >
          ...
        </div>
      </Help>)
  }
  function handleClickOpenHelp() {
    setopenHelp(!openHelp);
  }


  const fetchMathes = async (id_competicion, ronda) => {
    try {
      const teamsResponse = await axios.get(
        "http://localhost:3001/getMatchesByCompetition",
        {
          params: {
            value1: id_competicion,
            value2: ronda,
          },
        }
      );

      switch (ronda) {
        case competition_rounds[0].toUpperCase():
          setMatches((prevDict) => ({
            ...prevDict,
            Group_state: teamsResponse.data,
          }));
          break;
        case competition_rounds[1].toUpperCase():
          setMatches((prevDict) => ({
            ...prevDict,
            Round_of_16: teamsResponse.data,
          }));
          break;
        case competition_rounds[2].toUpperCase():
          setMatches((prevDict) => ({
            ...prevDict,
            Round_of_8: teamsResponse.data,
          }));
          break;
        case competition_rounds[3].toUpperCase():
          setMatches((prevDict) => ({
            ...prevDict,
            Semifinals: teamsResponse.data,
          }));
          break;
        case competition_rounds[4].toUpperCase():
          setMatches((prevDict) => ({
            ...prevDict,
            Final: teamsResponse.data,
          }));
          break;

        default:
          console.error("Numero de equipos a agrupar erroneo");
          break;
      }
      await fetchPartidosDisponibles(id_competicion);
    } catch (error) {
      console.error("Error generando los partidos:", error);
    }
  };


  const findMatchById = (id, ronda = "") => {
    switch (ronda) {
      //Caso sin ronda especificada, irá por todas 
      case "":
        var res = null;
        for (let index = 0; index < competition_rounds.length && res === null; index++) {
          res = findMatchById(id, competition_rounds[index].toUpperCase());
        }
        return res;
      case competition_rounds[0].toUpperCase():
        return matches.Group_state.find((match) => match.Idd === id) || null;
      case competition_rounds[1].toUpperCase():
        return matches.Round_of_16.find((match) => match.Idd === id) || null;
      case competition_rounds[2].toUpperCase():
        return matches.Round_of_8.find((match) => match.Idd === id) || null;
      case competition_rounds[3].toUpperCase():
        return matches.Semifinals.find((match) => match.Idd === id) || null;
      case competition_rounds[4].toUpperCase():
        return matches.Final.find((match) => match.Idd === id) || null;
      default:
        console.error("Error al encontrar el partido");
        return null;
    }
  };

  const handleMatches2 = async (ronda) => {
    let round_teams = {};
    let fechaPartidosRonda = new Date("2023-12-20T00:00:00");
    try {
      switch (ronda) {
        case competition_rounds[0].toUpperCase():
          round_teams = groups.Group_state;
          break;
        case competition_rounds[1].toUpperCase():
          round_teams = groups.Round_of_16;
          fechaPartidosRonda = new Date("2023-12-20T00:00:00");
          break;
        case competition_rounds[2].toUpperCase():
          round_teams = groups.Round_of_8;
          fechaPartidosRonda = new Date("2024-01-10T00:00:00");
          break;
        case competition_rounds[3].toUpperCase():
          round_teams = groups.Semifinals;
          fechaPartidosRonda = new Date("2024-02-01T00:00:00");
          break;
        case competition_rounds[4].toUpperCase():
          round_teams = groups.Final;
          fechaPartidosRonda = new Date("2024-02-15T00:00:00");
          break;

        default:
          console.error("Número de equipos a agrupar erroneo");
          break;
      }
      const d = [
        [0, 1],
        [1, 0],
      ];
      for (let i = 0; i < 2 /*ida y vuelta */; i++) {
        Object.keys(round_teams).map((letra) => {
          const cuotas = create_odds(round_teams[letra][d[i][0]].elo,
            round_teams[letra][d[i][1]].elo);

          const formattedDate = fechaPartidosRonda
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

          axios.post(
            "http://localhost:3001/addMatch",
            { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
            {
              local: round_teams[letra][d[i][0]].name,
              visitante: round_teams[letra][d[i][1]].name,
              fecha: formattedDate,
              location: round_teams[letra][d[i][0]].country,
              stadium: round_teams[letra][d[i][0]].stadium,
              grupo: round_teams[letra][d[i][0]].id_grupo,
              cuota_local: cuotas.local,
              cuota_empate: cuotas.draw,
              cuota_visitante: cuotas.away,
            }
          );
        });
        fechaPartidosRonda.setDate(fechaPartidosRonda.getDate() + 7);
      }
      await updateCompetitionState(competition_statuses[competition.estado.split(".")[0]]);
      fetchCompetitionInfo();
    } catch (error) {
      console.error("Error al crear los partidos: ", error);
    }
  };

  const handleGroupMatches = async () => {
    const jornadas = [
      [0, 1, 2, 3],
      [1, 2, 0, 3],
      [3, 1, 2, 0],
      [0, 2, 1, 3],
      [3, 2, 1, 0],
      [3, 0, 2, 1],
    ];

    try {
      var fech = new Date("2023-09-12T21:00:00");

      for (let i = 0; i < jornadas.length; i++) {
        Object.keys(groups.Group_state).map((letra) => {
          for (let j = 0; j <= 2; j = j + 2) {
            const cuotas = create_odds(groups.Group_state[letra][jornadas[i][j]].elo,
              groups.Group_state[letra][jornadas[i][j + 1]].elo)
            const formattedDate = fech
              .toISOString()
              .slice(0, 19)
              .replace("T", " ");

            axios.post("http://localhost:3001/addMatch", {
              local: groups.Group_state[letra][jornadas[i][j]].name,
              visitante: groups.Group_state[letra][jornadas[i][j + 1]].name,
              fecha: formattedDate,
              location: groups.Group_state[letra][jornadas[i][j]].country,
              stadium: groups.Group_state[letra][jornadas[i][j]].stadium,
              grupo: groups.Group_state[letra][jornadas[i][j]].id_grupo,
              cuota_local: cuotas.local,
              cuota_empate: cuotas.draw,
              cuota_visitante: cuotas.away,
            });
          }
        });
        fech.setDate(fech.getDate() + 14);
      }
      await updateCompetitionState("3.MATCHED");
      fetchCompetitionInfo();
    } catch (error) {
      console.error("no va: ", error);
    }
  };
  const handleAdvance = async () => {
    if (IdMatchesReadyToPlay <= 0) {
      try {
        const readies = await axios.put("http://localhost:3001/avanzarUnDia", {
          value1: competition.ID,
        });
        setIdMatchesReadyToPlay(readies.data);
        readies.data.forEach(async (element) => {
          await axios.put(
            "http://localhost:3001/partidoDisponible",
            {
              value1: element.Idd,
            }
          );
        });
        fetchCompetitionInfo();
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Quedan partidos por simular: ", IdMatchesReadyToPlay.length);
    }
  };

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

    //check todos los partidos aun no están jugados
    for (let i = 0; i < ticket.bets.length && confirmation_check === true; i++) {
      const iii = findMatchById(ticket.bets[i].match_ID);
      if (iii.estado_partido === "ENDED") {
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

      await updateWallet(-(aux_coins));

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
      `http://localhost:3001/setCompetitionCoins/${competition.ID}`,
      {
        value1: (competition.monedas + coins),
      }
    );
    setCompetition({ ...competition, monedas: competition.monedas + coins });
  }

  const openBetCard = () => {
    setBetCart(true);
  };
  const closeBetCard = () => {
    setBetCart(false);
  };

  const checkBetResults = async () => {
    const temp_notification = {
      apuestas_ganadas: 0,
      apuestas_perdidas: 0,
      apuestas_sin_finalizar: 0,
    };
    let cash_won = 0;
    //CHECKEO TICKET
    for (let i = 0; i < bets.length; i++) {
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
          const match_aux = findMatchById(bets[i].bets[j].match.Idd);
          console.log("partido apostado: ", match_aux);

          if (match_aux.estado_partido === "ENDED") {
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
            await updateTicket(bets[i].ID, "WINNER");
            console.log(`apuesta ${i + 1} ganada`);
            temp_notification.apuestas_ganadas++;
            cash_won += bets[i].potencial_prize;
            break;
          case "looser":
            await updateTicket(bets[i].ID, "LOOSER");
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
    await updateWallet(cash_won);
    setNotificaction((prevNotifications) => ({
      ...prevNotifications,
      apuestas_sin_finalizar: temp_notification.apuestas_sin_finalizar,
      apuestas_ganadas: temp_notification.apuestas_ganadas,
      apuestas_perdidas: temp_notification.apuestas_perdidas,
    }));
    setopenPopup(true);
    fetchBets(competition.ID);
  };

  const updateTicket = async (id_Ticket, estado) => {
    await axios.put(
      `http://localhost:3001/updateEstadoTicket/${id_Ticket}`,
      {
        value1: estado,
      }
    );
  }

  const fetchBets = async (competition_id) => {
    const tickets_response = await axios.get(
      `http://localhost:3001/getLiveBetsByCompeticion/${competition_id}`
    );

    const grouped_tickets = groupTickets(tickets_response.data);
    var temp_ticket = [];

    for (const ticket_number in grouped_tickets) {
      var temp_bets = [];

      for (const bet_number in grouped_tickets[ticket_number]) {
        const bet = grouped_tickets[ticket_number][bet_number];
        const temp_match = findMatchById(bet.id_partido);

        temp_bets.push({ choice: bet.eleccion, odd: bet.cuota, match: temp_match });
      }
      temp_ticket.push({ ID: grouped_tickets[ticket_number][0].ID, bet_coins: grouped_tickets[ticket_number][0].cantidad_apostada, potencial_prize: grouped_tickets[ticket_number][0].ganancia_potencial, status: grouped_tickets[ticket_number][0].estado, bets: temp_bets });
    }
    setBets(temp_ticket);

  }

  const handleSimular = async (id_match, local, visitante, id_group) => {
    console.log(visitante);
    const result = generateMatchResult(local.category, visitante.category);
    const marcador_local = result.local;
    const marcador_visitante = result.away;
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
      `http://localhost:3001/updateEstadisticasEquipo/${local.name}/${id_group}`,
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
      `http://localhost:3001/updateEstadisticasEquipo/${visitante.name}/${id_group}`,
      { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
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
    fetchCompetitionInfo();
  };
  const groupTeams = (numberGroups) => {
    const groups_aux = Array.from({ length: numberGroups }, () => []);
    const countries_aux = Array.from({ length: numberGroups }, () => []);

    teams.Group_state.forEach((team, i) => {
      const country = team.country;
      let teamSet = false;

      let groupNumber = i % numberGroups;
      let tries = 0;
      while (!teamSet && tries < numberGroups) {
        if (
          (groups_aux[groupNumber].length < 1) |
          (!countries_aux[groupNumber].includes(country) &&
            groups_aux[groupNumber].length < 4)
        ) {
          groups_aux[groupNumber].push(team);
          countries_aux[groupNumber].push(country);
          teamSet = true;
        } else {
          groupNumber = (groupNumber + 1) % numberGroups;
          tries++;
          if (tries >= 8) {
            return null;
          }
        }
      }
    });
    return groups_aux;
  };
  const updateCompetitionState = async (estado) => {
    console.log("Estado a poner: ", estado);
    await axios.put("http://localhost:3001/updateCompetitionState", {
      value1: competition.ID,
      value2: estado,
    });
  }
  function getEquipoByNombre(nombre_club, clubes) {
    return clubes.filter(e => e.name === nombre_club)[0];
  }
  const handleGroupTeams = async () => {
    var d = null;
    try {
      do {
        d = groupTeams(Math.ceil(teams.Group_state.length / 4));
      } while (d === null);
      console.log("hecho group: ", d);

      for (let i = 0; i < d.length; i++) {
        let letra = String.fromCharCode(65 + i);

        //POST GROUP
        const groupResponse = await axios.post(
          "http://localhost:3001/addGroup",
          {
            value1: competition.ID,
            value2: competition_rounds[0].toUpperCase(),
            value3: letra,
          }
        );
        const backend_id_group = groupResponse.data;
        d[i].forEach(async (team) => {
          //POST TEAM
          await axios.post("http://localhost:3001/addEquipoToGroup", {
            value1: backend_id_group,
            value2: team.name,
          });
        });
      }
      setGroups((prevDict) => ({ ...prevDict, Group_state: d }));

      console.log(
        "competition: ",
        competition_statuses[competition.estado.split(".")[0]]
      );
      await updateCompetitionState(competition_statuses[competition.estado.split(".")[0]]);
      fetchCompetitionInfo();
    } catch (error) {
      console.error("Error grouping teams:", error);
    }
  };
  const handleKnockOutTeams = async (teamsInRound, teamsPerGroup) => {
    let round_teams = [];
    let ronda = "";
    switch (teamsInRound) {
      case 32:
        round_teams = teams.Group_state;
        ronda = "GROUP_STATE";
        break;
      case 16:
        round_teams = teams.Round_of_16;
        ronda = "ROUND_OF_16";
        break;
      case 8:
        round_teams = teams.Round_of_8;
        ronda = "ROUND_OF_8";
        break;
      case 4:
        round_teams = teams.Semifinals;
        ronda = "SEMIFINALS";
        break;
      case 2:
        round_teams = teams.Final;
        ronda = "FINAL";
        break;

      default:
        console.error("Numero de equipos a agrupar erroneo");
        break;
    }
    try {
      //TODO: Asegurarse de que el teamsInRound es una ronda
      // Randomly sort the teams and group them into 8 groups with 4 teams each

      const shuffledTeams = round_teams.sort(() => 0.5 - Math.random());

      const groupSize = teamsPerGroup;
      const groupedTeams = [];

      for (let index = 0; index < shuffledTeams.length / groupSize; index++) {
        let letra = String.fromCharCode(65 + index);
        //POST GROUP
        console.log("grupo a poner: ", ronda, letra);
        const groupResponse = await axios.post(
          "http://localhost:3001/addGroup",
          {
            value1: competition.ID,
            value2: ronda,
            value3: letra,
          }
        );
        const backend_id_group = groupResponse.data;

        for (let j = 0; j < groupSize; j++) {
          const team_aux = shuffledTeams[index * groupSize + j];
          console.log("Equipo a poner: ", backend_id_group, team_aux.name);
          //POST TEAM
          await axios.post(
            "http://localhost:3001/addEquipoToGroup",
            {
              value1: backend_id_group,
              value2: team_aux.name,
            }
          );
        }
        groupedTeams.push({
          index,
          teams: shuffledTeams.slice(
            index * groupSize,
            (index + 1) * groupSize
          ),
        });
      }

      switch (teamsInRound) {
        case 32:
          setGroups((prevDict) => ({ ...prevDict, Group_state: groupedTeams }));
          break;
        case 16:
          setGroups((prevDict) => ({ ...prevDict, Round_of_16: groupedTeams }));
          break;
        case 8:
          setGroups((prevDict) => ({ ...prevDict, Round_of_8: groupedTeams }));
          break;
        case 4:
          setGroups((prevDict) => ({ ...prevDict, Semifinals: groupedTeams }));
          break;
        case 2:
          setGroups((prevDict) => ({ ...prevDict, Final: groupedTeams }));
          break;

        default:
          console.error("Numero de equipos a agrupar erroneo");
          break;
      }
      await updateCompetitionState(competition_statuses[competition.estado.split(".")[0]]);

      fetchCompetitionInfo();
    } catch (error) {
      console.error("Error grouping teams:", error);
    }
  };

  const toggleAccordion = (index) => {
    if (active === index) {
      setActive(-1);
    } else {
      setActive(index);
    }
  };
  const getGroups = (groupss, usuarioo, ronda) => {
    return (
      <>
        <h2>{ronda}</h2>
        <div className="group-short-container">
          {Object.keys(groupss).map((letra, index) => (
            <div key={index}>
              <table
                className="group-short"
                onClick={() =>
                  navigate(`/grupo/${letra.split(",")[0]}`, {
                    state: { group: letra.split(",")[0], usuario: usuarioo },
                  })
                }
              >
                <thead className="group-short-head">
                  <p>{ronda} {letra.split(",")[1]}</p>
                </thead>
                <tbody className="group-short-body">
                  {groupss[letra].map((team, index) => (
                    <div key={index} className="group-short-team">
                      {team.name} ({team.country})
                    </div>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </>
    )
  }
  const getInfoPartidos = (partidos, ronda) => {
    return (
      <div>
        <h2>PARTIDOS: </h2>
        <p>DISPONIBLES: {IdMatchesReadyToPlay.length}</p>
        <button
          onClick={handleAdvance}
          disabled={
            loading ||
            +competition?.estado.split(".")[0] !== 3 ||
            IdMatchesReadyToPlay.length !== 0
          } >
          Avanzar Día
        </button>
        {partidos != [] &&
          groupByJornada(partidos).map((jornada, index) => (
            <div key={index}>

              <div className="accordion_header" onClick={() => toggleAccordion(index)}>
                <h2>JORNADA {index + 1}:</h2>
                <span>{active === index ? '^' : '>'}</span>
              </div>

              {active === index && (
                <div className="answer">
                  {jornada.map((match, index) => (
                    <div key={index} className="match-short-container">
                      <div className="match-short-header">
                        <div className="match-short-place">
                          {match.stadium} in {match.location}
                        </div>
                        <div className="match-short-date">{match.fecha}</div>
                      </div>

                      <div className="match-short-body">
                        <div
                          className="match-short-column"
                          onClick={() =>
                            navigate(`/partido/${match.Idd}`, {
                              state: { match: match.Idd, usuario: user, bets: bets, competition: competition, local: getEquipoByNombre(match.club_local, teams[ronda]), visitante: getEquipoByNombre(match.club_visitante, teams[ronda]) },
                            })
                          }
                        >
                          <div className="team-short-name">
                            {match.club_local}
                          </div>
                        </div>

                        <div
                          className="match-short-column"
                          onClick={() =>
                            navigate(`/partido/${match.Idd}`, {
                              state: { match: match.Idd, usuario: user, bets: bets, competition: competition, local: getEquipoByNombre(match.club_local, teams[ronda]), visitante: getEquipoByNombre(match.club_visitante, teams[ronda]) },
                            })
                          }
                        >
                          <div className="match-short-score">
                            {match.marcador_local} - {match.marcador_visitante}
                          </div>
                        </div>

                        <div
                          className="match-short-column"
                          onClick={() =>
                            navigate(`/partido/${match.Idd}`, {
                              state: { match: match.Idd, usuario: user, bets: bets, competition: competition, local: getEquipoByNombre(match.club_local, teams[ronda]), visitante: getEquipoByNombre(match.club_visitante, teams[ronda]) },
                            })
                          }
                        >
                          <div className="team-short-name">
                            {match.club_visitante}
                          </div>
                        </div>

                        <div className="match-short-column">
                          <div className="match-short-bet-options">
                            <div className="match-short-bet-option">
                              1
                              <button
                                onClick={() =>
                                  handleBet(
                                    match,
                                    match.cuota_local,
                                    "Local"
                                  )
                                }
                                disabled={match.estado_partido === "ENDED"}
                              >
                                {match.cuota_local}
                              </button>
                            </div>
                            <div className="match-short-bet-option">
                              X
                              <button
                                onClick={() =>
                                  handleBet(
                                    match,
                                    match.cuota_empate,
                                    "Draw"
                                  )
                                }
                                disabled={match.estado_partido === "ENDED"}
                              >
                                {match.cuota_empate}
                              </button>
                            </div>
                            <div className="match-short-bet-option">
                              2
                              <button
                                onClick={() =>
                                  handleBet(
                                    match,
                                    match.cuota_visitante,
                                    "Away"
                                  )
                                }
                                disabled={match.estado_partido === "ENDED"}
                              >
                                {match.cuota_visitante}
                              </button>
                            </div>
                          </div>
                          <div className="match-short-simulate">
                            <button
                              onClick={() =>
                                handleSimular(
                                  match.Idd,
                                  getEquipoByNombre(match.club_local, teams[ronda]),
                                  getEquipoByNombre(match.club_visitante, teams[ronda]),
                                  match.id_group
                                )
                              }
                              disabled={
                                loading ||
                                match.estado_partido !== "READY_TO_PLAY"
                              }
                            >
                              JUGAR PARTIDO
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    )
  }

  ////////        EXECUTION         //////////////

  if (openPopup) {
    return (
      <Popup trigger={openPopup} setTrigger={setopenPopup}>
        <p>- Ganadas: {notifications.apuestas_ganadas} </p>
        <p>- Perdidas: {notifications.apuestas_perdidas}</p>
        <p>- Sin finalizar: {notifications.apuestas_sin_finalizar} </p>
      </Popup>
    );
  }
  const renderContent = () => {
    switch (currentSection.split(".")[0]) {
      case "1":
        return (
          <div>
            {getInfoEquipos(teams.Group_state)}
            <button
              onClick={() => handleGroupTeams()}
              disabled={loading || +competition?.estado.split(".")[0] > 1}
            >
              Hacer Grupos
            </button>
          </div>
        );
      case "2":
        return (
          <div>
            {getGroups(groups.Group_state, user,"GRUPO")}
            <button
              onClick={handleGroupMatches}
              disabled={loading || +competition?.estado.split(".")[0] > 2}
            >
              Generar Partidos
            </button>
          </div>
        );

      case "3":
        return (
          <div>{getInfoPartidos(matches.Group_state, competition_rounds[0])}</div>
        );
      case "4":
        return (
          <div>
            {getInfoEquipos(teams.Round_of_16)}
            <button
              onClick={() => handleKnockOutTeams(16, 2)}
              disabled={loading || +competition?.estado.split(".")[0] !== 4}
            >
              Sorteo Eliminatorias
            </button>
          </div>
        );

      case "5":
        return (
          <div>
            {getGroups(groups.Round_of_16, user,"OCTAVOS")}
            
            <button
              onClick={() =>
                handleMatches2(competition_rounds[1].toUpperCase())
              }
              disabled={loading || +competition?.estado.split(".")[0] < 4}
            >
              Generar Partidos
            </button>
          </div>
        );
      case "6":
        return (
          <div>{getInfoPartidos(matches.Round_of_16)}</div>
        );
      case "7":
        return (
          <div>
            <h2>Teams cuartos:</h2>
            {teams.Round_of_8.map((team) => (
              <p key={team.id}>
                {team.name}, {team.country}
              </p>
            ))}

            <button
              onClick={() => handleKnockOutTeams(8, 2)}
              disabled={loading || +competition?.estado.split(".")[0] != 7}
            >
              Sorteo Eliminatorias
            </button>
          </div>
        );
      case "8":
        return (
          <div>
            <h2>CUARTOS de final:</h2>
            {Object.keys(groups.Round_of_8).map((letra, index) => (
              <div key={index}>
                <div
                  onClick={() =>
                    navigate(`/grupo/${letra.split(",")[0]}`, {
                      state: { group: letra.split(",")[0], usuario: user },
                    })
                  }
                >
                  <h3>Octavos {letra.split(",")[1]}:</h3>
                  {groups.Round_of_8[letra].map((team, index) => (
                    <div key={index}>
                      - {team.name} - {team.country}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                handleMatches2(competition_rounds[2].toUpperCase())
              }
              disabled={loading || +competition?.estado.split(".")[0] != 8}
            >
              Generar Partidos
            </button>
          </div>
        );
      case "9":
        return (
          <div>{getInfoPartidos(matches.Round_of_8)}</div>
        );
      case "10":
        return (
          <div>
            <h2>Teams Semifinales:</h2>
            {teams.Semifinals.map((team) => (
              <p key={team.id}>
                {team.name}, {team.country}
              </p>
            ))}

            <button
              onClick={() => handleKnockOutTeams(4, 2)}
              disabled={loading || +competition?.estado.split(".")[0] != 10}
            >
              Sorteo Semifinales
            </button>
          </div>
        );
      case "11":
        return (
          <div>
            <h2>SEMIFINALES:</h2>
            {Object.keys(groups.Semifinals).map((letra, index) => (
              <div key={index}>
                <div
                  onClick={() =>
                    navigate(`/grupo/${letra.split(",")[0]}`, {
                      state: { group: letra.split(",")[0], usuario: user },
                    })
                  }
                >
                  <h3>Octavos {letra.split(",")[1]}:</h3>
                  {groups.Semifinals[letra].map((team, index) => (
                    <div key={index}>
                      - {team.name} - {team.country}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                handleMatches2(competition_rounds[3].toUpperCase())
              }
              disabled={loading || +competition?.estado.split(".")[0] !== 11}
            >
              Generar Partidos
            </button>
          </div>
        );
      case "12":
        return (
          <div>{getInfoPartidos(matches.Semifinals)}</div>
        );
      case "13":
        return (
          <div>
            <h2>Teams Final:</h2>
            {teams.Final.map((team) => (
              <p key={team.id}>
                {team.name}, {team.country}
              </p>
            ))}

            <button
              onClick={() => handleKnockOutTeams(2, 2)}
              disabled={loading || +competition?.estado.split(".")[0] != 13}
            >
              Sorteo Final
            </button>
          </div>
        );
      case "14":
        return (
          <div>
            <h2>FINAL:</h2>
            {Object.keys(groups.Final).map((letra, index) => (
              <div key={index}>
                <div
                  onClick={() =>
                    navigate(`/grupo/${letra.split(",")[0]}`, {
                      state: { group: letra.split(",")[0], usuario: user },
                    })
                  }
                >
                  <h3>FINAL {letra.split(",")[1]}:</h3>
                  {groups.Final[letra].map((team, index) => (
                    <div key={index}>
                      - {team.name} - {team.country}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                handleMatches2(competition_rounds[4].toUpperCase())
              }
              disabled={loading || +competition?.estado.split(".")[0] !== 14}
            >
              Generar Partidos
            </button>
          </div>
        );
      case "15":
        return (
          <div>{getInfoPartidos(matches.Final)}</div>
        );
      case "16":
        return (
          <div>
            <h2>CHAMPIONS:</h2>
            {teams.Champion.map((team) => (
              <p key={team.id}>
                {team.name}, {team.country}
              </p>
            ))}
          </div>
        );

      default:
        return <p>NO INFO TO SHOW YET</p>;
    }
  };

  const renderNavbar = () => {
    return (
      <div className="botoness">
        {competition_statuses.map((state, index) => (
          <button className="navbar-item" key={index}
            onClick={() => setCurrentSection(state)}
            disabled={
              loading ||
              +state.split(".")[0] > +competition?.estado.split(".")[0]
            }
          >
            {state.split(".")[1]}
          </button>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="Inicio-partida">
          <div className="top-container">
            <div className="profile-container">
              {user && (
                <div className="profil">
                  <h2 className="title">PERFIL</h2>
                  <div className="item">
                    <p className="big-text">{user?.nombre_usuario}</p>
                    <p className="regular-text">Nombre</p>
                  </div>
                  <div className="item">
                    <p className="big-text">{bets.length}</p>
                    <p className="regular-text">Apuestas</p>
                  </div>
                  <button onClick={openBetCard}>Ver Apuestas</button>
                </div>
              )}
            </div>
            <div className="date-container">
              {competition && (
                <div>
                  <div className="item">
                    <p className="big-text">{competition?.temporada}</p>
                    <p className="regular-text">Temporada</p>
                  </div>
                  <div className="item">
                    <p className="big-text">{competition?.estado}</p>
                    <p className="regular-text">Estado Actual</p>
                  </div>
                  <div className="item">
                    <p className="big-text">{competition?.monedas}</p>
                    <p className="regular-text">Monedas</p>
                  </div>
                  <div className="item">
                    <p className="big-text">{competition?.dia.split("T")[0]}</p>
                    <p className="regular-text">Día</p>
                  </div>

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
          <div className="bottom-container">
            <div className="nav-butons">{renderNavbar()}</div>
            <div className="nav-content"> {renderContent()}</div>
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
                <button onClick={checkBetResults}>CHECK BET RESULTS</button>
                <button onClick={closeBetCard}>CERRAR</button>
              </div>
            </div>
          )}
        </div>
      )}
      <button className="button-help" onClick={handleClickOpenHelp}>?</button>
    </Layout>
  );
};

export default Inicio;
