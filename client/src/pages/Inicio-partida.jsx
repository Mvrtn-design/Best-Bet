import React from "react";
import Popup from "./partials/Popup";
import Layout from "./partials/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

import "../Appp.css";

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
    monedas: 0,
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

  //// CURRENT STATE

  let temporada_actual = "2023";
  const [currentSection, setCurrentSection] = useState(competition_statuses[0]);
  const [loading, setLoading] = useState(true);
  const [IdMatchesReadyToPlay, setIdMatchesReadyToPlay] = useState([]);
  const fechas = {
    octavos: new Date(`${temporada_actual}-12-01T00:00:00`)
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
    if (loading == false) {
      setLoading(true);
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
        });

        setUser({
          ID: user_backend_data.data[0].id,
          monedas: user_backend_data.data[0].monedas,
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
          await fetchPartidosDisponibles(Competition_data.ID);
          if (fechas.octavos == competition_response.data[0].dia) {
            setNewRound(competition_statuses[3]);
          }
          /// OCTAVOS
        }
        if (Competition_data.estado.split(".")[0] > 3) {
          const oct = await fetchOctavosFinal();
          setTeams((prevDict) => ({ ...prevDict, Round_of_16: oct }));
        }
        if (Competition_data.estado.split(".")[0] > 4) {
          fetchGroups(Competition_data.ID, competition_rounds[1].toUpperCase());
          fetchMathes(Competition_data.ID, competition_rounds[1].toUpperCase());
        }
        if (Competition_data.estado.split(".")[0] > 5) {
          fetchPartidosDisponibles(Competition_data.ID);
          if (fechas.cuartos == competition.dia) {
            setNewRound(competition_statuses[6]);
          }
          //////  CUARTOS
        }
        if (Competition_data.estado.split(".")[0] > 6) {
          const oct = await fetchClasificados(competition_rounds[1]);
          setTeams((prevDict) => ({ ...prevDict, Round_of_8: oct }));
        }
        if (Competition_data.estado.split(".")[0] > 7) {
          fetchGroups(Competition_data.ID, competition_rounds[2].toUpperCase());
          fetchMathes(Competition_data.ID, competition_rounds[2].toUpperCase());
        }
        if (Competition_data.estado.split(".")[0] > 8) {
          fetchPartidosDisponibles(Competition_data.ID);
          if (fechas.Semifinales == competition.dia) {
            setNewRound(competition_statuses[9]);
          }
          /// SEMIFINALES
        }
        if (Competition_data.estado.split(".")[0] > 9) {
          const semis = await fetchClasificados(competition_rounds[2]);
          setTeams((prevDict) => ({ ...prevDict, Semifinals: semis }));
        }
        if (Competition_data.estado.split(".")[0] > 10) {
          fetchGroups(Competition_data.ID, competition_rounds[3].toUpperCase());
          fetchMathes(Competition_data.ID, competition_rounds[3].toUpperCase());
        }
        if (Competition_data.estado.split(".")[0] > 11) {
          fetchPartidosDisponibles(Competition_data.ID);
          if (fechas.final == competition.dia) {
            setNewRound(competition_statuses[12]);
          }
        }
        //// FINAL
        if (Competition_data.estado.split(".")[0] > 12) {
          const semis = await fetchClasificados(competition_rounds[3]);
          setTeams((prevDict) => ({ ...prevDict, Final: semis }));
        }
        if (Competition_data.estado.split(".")[0] > 13) {
          fetchGroups(Competition_data.ID, competition_rounds[4].toUpperCase());
          fetchMathes(Competition_data.ID, competition_rounds[4].toUpperCase());
        }
        if (Competition_data.estado.split(".")[0] > 14) {
          fetchPartidosDisponibles(Competition_data.ID);
          if (fechas.Champion == competition.dia) {
            setNewRound(competition_statuses[15]);
          }
        }
        //////// CHAMPION
        if (Competition_data.estado.split(".")[0] > 15) {
          const semis = await fetchClasificados(competition_rounds[4]);
          setTeams((prevDict) => ({ ...prevDict, Champion: semis }));
        }
        
        
        setTimeout(() => {
          /// APUESTAS
        fetchBets(competition_response.data[0].ID);
          setLoading(false);
       }, 2000);
      }
    } catch (error) {
      console.error("Error fetching competition info: ", error);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCompetitionInfo();
  }, []);



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

  const setNewRound = async (ronda) => {
    await axios.put(
      "http://localhost:3001/updateCompetitionState",
      { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
      {
        value1: competition.ID,
        value2: ronda,
      }
    );
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

  function makeCuotas(local_cat, away_cat) {
    const results = [];
    for (let index = 0; index < 3; index++) {
      results.push(parseFloat(Math.random() * (1.9 - 1.1) + 1.1).toFixed(2));
    }
    return results;
  }
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
          var cuotas = makeCuotas(
            round_teams[letra][d[i][0]].category,
            round_teams[letra][d[i][1]].category
          );
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
              cuota_local: cuotas[0],
              cuota_empate: cuotas[1],
              cuota_visitante: cuotas[2],
            }
          );
        });
        fechaPartidosRonda.setDate(fechaPartidosRonda.getDate() + 7);
      }
      await axios.put(
        "http://localhost:3001/updateCompetitionState",
        { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
        {
          value1: competition.ID,
          value2: competition_statuses[competition.estado.split(".")[0]],
        }
      );

      fetchCompetitionInfo();
    } catch (error) {
      console.error("Error al crear los partidos: ", error);
    }
  };

  const handleGroupMatches = async () => {
    const order = [
      [0, 1, 2, 3],
      [1, 2, 0, 3],
      [3, 1, 2, 0],
      [0, 2, 1, 3],
      [3, 2, 1, 0],
      [3, 0, 2, 1],
    ];

    try {
      var fech = new Date("2023-09-12T21:00:00");

      for (let i = 0; i < order.length; i++) {
        Object.keys(groups.Group_state).map((letra) => {
          for (let j = 0; j < 2; j++) {
            const cuotas = makeCuotas(
              groups.Group_state[letra][order[i][j]].category,
              groups.Group_state[letra][order[i][j + 1]].category
            );
            const formattedDate = fech
              .toISOString()
              .slice(0, 19)
              .replace("T", " ");

            axios.post("http://localhost:3001/addMatch", {
              local: groups.Group_state[letra][order[i][j]].name,
              visitante: groups.Group_state[letra][order[i][j + 1]].name,
              fecha: formattedDate,
              location: groups.Group_state[letra][order[i][j]].country,
              stadium: groups.Group_state[letra][order[i][j]].stadium,
              grupo: groups.Group_state[letra][order[i][j]].id_grupo,
              cuota_local: cuotas[0],
              cuota_empate: cuotas[1],
              cuota_visitante: cuotas[2],
            });
          }
        });
        fech.setDate(fech.getDate() + 14);
      }
      await axios.put("http://localhost:3001/updateCompetitionState", {
        value1: competition.ID,
        value2: "3.MATCHED",
      });
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
            { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
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
  const handleBet = (match, cuota, bet_choice, ronda) => {
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
          const match_aux = findMatchById(bets[i].bets[j].match.Idd);
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
      temp_ticket.push({ bet_coins: grouped_tickets[ticket_number][0].cantidad_apostada, potencial_prize: grouped_tickets[ticket_number][0].ganancia_potencial, status: grouped_tickets[ticket_number][0].estado, bets: temp_bets });
    }
    setBets(temp_ticket);
  }

  const handleSimular = async (id_match, local, visitante, id_group) => {
    const marcador_local = Math.round(Math.random() * 4);
    const marcador_visitante = Math.round(Math.random() * 4);
    const estado_partido = "ENDED";

    await axios.put(
      `http://localhost:3001/updateResultadoPartido/${id_match}`,
      { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
      {
        value1: marcador_local,
        value2: marcador_visitante,
        value3: estado_partido,
      }
    );

    //Local
    await axios.put(
      `http://localhost:3001/updateEstadisticasEquipo/${local}/${id_group}`,
      { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
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
      `http://localhost:3001/updateEstadisticasEquipo/${visitante}/${id_group}`,
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
            : marcador_local == marcador_visitante
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

      await axios.put("http://localhost:3001/updateCompetitionState", {
        value1: competition.ID,
        value2: competition_statuses[competition.estado.split(".")[1]],
      });
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
        const groupResponse = await axios.post(
          "http://localhost:3001/addGroup",
          { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
          {
            value1: competition.ID,
            value2: ronda,
            value3: letra,
          }
        );
        const backend_id_group = groupResponse.data;

        for (let j = 0; j < groupSize; j++) {
          const team_aux = shuffledTeams[index * groupSize + j];

          //POST TEAM
          await axios.post(
            "http://localhost:3001/addEquipoToGroup",
            { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
            {
              value1: backend_id_group,
              value2: team_aux.name,
            }
          );
        }
        groupedTeams.push({
          letra,
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

      await axios.put(
        "http://localhost:3001/updateCompetitionState",
        { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
        {
          value1: competition.ID,
          value2: competition_statuses[competition.estado.split(".")[0]],
        }
      );
      fetchCompetitionInfo();
    } catch (error) {
      console.error("Error grouping teams:", error);
    }
  };

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
            <h2>Teams:</h2>
            {teams.Group_state.map((team, index) => (
              <div key={`${team.id}-${index}`}>
                <p>
                  {team.name}, {team.country}
                </p>
              </div>
            ))}

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
            <h2>Groups</h2>
            <div className="group-short-container">
              {Object.keys(groups.Group_state).map((letra, index) => (
                <div key={index}>
                  <table
                    className="group-short"
                    onClick={() =>
                      navigate(`/grupo/${letra.split(",")[0]}`, {
                        state: { group: letra.split(",")[0], usuario: user },
                      })
                    }
                  >
                    <thead className="group-short-head">
                      <p>GRUPO {letra.split(",")[1]}</p>
                    </thead>
                    <tbody className="group-short-body">
                      {groups.Group_state[letra].map((team, index) => (
                        <div key={index} className="group-short-team">
                          {team.name} ({team.country})
                        </div>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
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
          <div>
            <h2>PARTIDOS: </h2>
            <p>DISPONIBLES: {IdMatchesReadyToPlay.length}</p>
            <button
              onClick={handleAdvance}
              disabled={
                loading ||
                +competition?.estado.split(".")[0] !== 3 ||
                IdMatchesReadyToPlay.length !== 0
              }
            >
              Avanzar
            </button>
            {matches.Group_state != [] &&
              groupByJornada(matches.Group_state).map((jornada, index) => (
                <div key={index}>
                  <h2>JORNADA {index + 1}:</h2>
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
                              state: { match: match.Idd, usuario: user },
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
                              state: { match: match.Idd, usuario: user },
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
                              state: { match: match.Idd, usuario: user },
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
                                    "Local",
                                    competition_rounds[0]
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
                                    "Draw",
                                    competition_rounds[0]
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
                                    "Away",
                                    competition_rounds[0]
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
                                  match.club_local,
                                  match.club_visitante,
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
              ))}
          </div>
        );
      case "4":
        return (
          <div>
            <h2>Teams:</h2>
            {teams.Round_of_16.map((team) => (
              <p key={team.id}>
                {team.name}, {team.country}
              </p>
            ))}

            <button
              onClick={() => handleGroupTeams(16, 2)}
              disabled={loading || +competition?.estado.split(".")[0] !== 4}
            >
              Sorteo Eliminatorias
            </button>
          </div>
        );

      case "5":
        return (
          <div>
            <h2>Octavos de final:</h2>
            {Object.keys(groups.Round_of_16).map((letra, index) => (
              <div key={index}>
                <div
                  onClick={() =>
                    navigate(`/grupo/${letra.split(",")[0]}`, {
                      state: { group: letra.split(",")[0], usuario: user },
                    })
                  }
                >
                  <h3>Octavos {letra.split(",")[1]}:</h3>
                  {groups.Round_of_16[letra].map((team, index) => (
                    <div key={index}>
                      - {team.name} - {team.country}
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
          <div>
            <h2>PARTIDOS: </h2>
            <p>DISPONIBLES: {IdMatchesReadyToPlay.length}</p>
            <button
              onClick={handleAdvance}
              disabled={
                loading ||
                +competition?.estado.split(".")[0] !== 6 ||
                IdMatchesReadyToPlay.length !== 0
              }
            >
              Avanzar
            </button>
            {matches.Round_of_16 != [] &&
              matches.Round_of_16.map((match, index) => (
                <div key={index}>
                  <div
                    onClick={() =>
                      navigate(`/partido/${match.Idd}`, {
                        state: { match: match.Idd, usuario: user },
                      })
                    }
                  >
                    <h3>
                      {match.club_local} {match.marcador_local} -{" "}
                      {match.marcador_visitante} {match.club_visitante}
                    </h3>
                  </div>
                  <p>
                    - {match.stadium} in {match.location}
                  </p>
                  <p>- {match.fecha}</p>
                  <button
                    onClick={() =>
                      handleSimular(
                        match.Idd,
                        match.club_local,
                        match.club_visitante,
                        match.id_group
                      )
                    }
                    disabled={
                      loading || match.estado_partido !== "READY_TO_PLAY"
                    }
                  >
                    JUGAR PARTIDO
                  </button>
                </div>
              ))}
          </div>
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
              onClick={() => handleGroupTeams(8, 2)}
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
          <div>
            <h2>PARTIDOS: </h2>
            <p>DISPONIBLES: {IdMatchesReadyToPlay.length}</p>
            <button
              onClick={handleAdvance}
              disabled={
                loading ||
                +competition?.estado.split(".")[0] !== 9 ||
                IdMatchesReadyToPlay.length != 0
              }
            >
              Avanzar
            </button>
            {matches.Round_of_8 != [] &&
              matches.Round_of_8.map((match, index) => (
                <div key={index}>
                  <div
                    onClick={() =>
                      navigate(`/partido/${match.Idd}`, {
                        state: { match: match.Idd, usuario: user },
                      })
                    }
                  >
                    <h3>
                      {match.club_local} {match.marcador_local} -{" "}
                      {match.marcador_visitante} {match.club_visitante}
                    </h3>
                  </div>
                  <p>
                    - {match.stadium} in {match.location}
                  </p>
                  <p>- {match.fecha}</p>
                  <button
                    onClick={() =>
                      handleSimular(
                        match.Idd,
                        match.club_local,
                        match.club_visitante,
                        match.id_group
                      )
                    }
                    disabled={
                      loading || match.estado_partido !== "READY_TO_PLAY"
                    }
                  >
                    JUGAR PARTIDO
                  </button>
                </div>
              ))}
          </div>
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
              onClick={() => handleGroupTeams(4, 2)}
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
          <div>
            <h2>PARTIDOS: </h2>
            <p>DISPONIBLES: {IdMatchesReadyToPlay.length}</p>
            <button
              onClick={handleAdvance}
              disabled={
                loading ||
                +competition?.estado.split(".")[0] !== 12 ||
                IdMatchesReadyToPlay.length != 0
              }
            >
              Avanzar
            </button>
            {matches.Semifinals != [] &&
              matches.Semifinals.map((match, index) => (
                <div key={index}>
                  <div
                    onClick={() =>
                      navigate(`/partido/${match.Idd}`, {
                        state: { match: match.Idd, usuario: user },
                      })
                    }
                  >
                    <h3>
                      {match.club_local} {match.marcador_local} -{" "}
                      {match.marcador_visitante} {match.club_visitante}
                    </h3>
                  </div>
                  <p>
                    - {match.stadium} in {match.location}
                  </p>
                  <p>- {match.fecha}</p>
                  <button
                    onClick={() =>
                      handleSimular(
                        match.Idd,
                        match.club_local,
                        match.club_visitante,
                        match.id_group
                      )
                    }
                    disabled={
                      loading || match.estado_partido !== "READY_TO_PLAY"
                    }
                  >
                    JUGAR PARTIDO
                  </button>
                </div>
              ))}
          </div>
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
              onClick={() => handleGroupTeams(2, 2)}
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
          <div>
            <h2>PARTIDOS: </h2>
            <p>DISPONIBLES: {IdMatchesReadyToPlay.length}</p>
            <button
              onClick={handleAdvance}
              disabled={
                loading ||
                +competition?.estado.split(".")[0] !== 15 ||
                IdMatchesReadyToPlay.length != 0
              }
            >
              Avanzar
            </button>
            {matches.Final != [] &&
              matches.Final.map((match, index) => (
                <div key={index}>
                  <div
                    onClick={() =>
                      navigate(`/partido/${match.Idd}`, {
                        state: { match: match.Idd, usuario: user },
                      })
                    }
                  >
                    <h3>
                      {match.club_local} {match.marcador_local} -{" "}
                      {match.marcador_visitante} {match.club_visitante}
                    </h3>
                  </div>
                  <p>
                    - {match.stadium} in {match.location}
                  </p>
                  <p>- {match.fecha}</p>
                  <button
                    onClick={() =>
                      handleSimular(
                        match.Idd,
                        match.club_local,
                        match.club_visitante,
                        match.id_group
                      )
                    }
                    disabled={
                      loading || match.estado_partido !== "READY_TO_PLAY"
                    }
                  >
                    JUGAR PARTIDO
                  </button>
                </div>
              ))}
          </div>
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
                    <p className="big-text">{user?.monedas}</p>
                    <p className="regular-text">Monedas</p>
                  </div>
                  <div className="item">
                    <p className="big-text">0</p>
                    <p className="regular-text">Apuestas</p>
                  </div>
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
                    <p className="big-text">{competition?.dia.split("T")[0]}</p>
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
      )}
    </Layout>
  );
};

export default Inicio;
