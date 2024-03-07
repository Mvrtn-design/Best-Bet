import React from "react";
import Popup from "./partials/Popup";
import Layout from "./partials/Layout";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { idPartida } = useParams();
  const [competition, setCompetition] = useState({
    ID: 0,
  });
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
  const [sidebar, setSidebar] = useState({
    open: false,
    match: null,
    coinBet: 0,
    odd: 0,
    betChoice: null,
  });
  const [notifications, setNotificaction] = useState({
    apuestas_ganadas: 0,
    apuestas_perdidas: 0,
    apuestas_sin_finalizar: 0,
  });
  const [currentSection, setCurrentSection] = useState(competition_statuses[0]);
  const [loading, setLoading] = useState(true);
  const [IdMatchesReadyToPlay, setIdMatchesReadyToPlay] = useState([]);
  const [bets, setBets] = useState([]);
  const [openPopup, setopenPopup] = useState(false);
  const [betCard, setBetCart] = useState(false);
  const fechas = {
    octavos: new Date("2023-12-01T00:00:00").toISOString().slice(0, 24),
    cuartos: new Date("2024-01-05T00:00:00").toISOString().slice(0, 24),
    Semifinales: new Date("2024-01-20T00:00:00").toISOString().slice(0, 24),
    final: new Date("2024-02-10T00:00:00").toISOString().slice(0, 24),
    Champion: new Date("2024-03-01T00:00:00").toISOString().slice(0, 24),
  };
  ////////              FUNCTIONS         ////////////
  useEffect(() => {
    fetchCompetitionInfo();
  }, []);

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
      const response = await axios.get(
        `http://localhost:3001/getCompeticionByPartida/${idPartida}`
      );
      if (user_backend_data.data.error) {
        alert(user_backend_data.data.error);
        console.error(user_backend_data.error);
        navigate("/");
      } else {
        const Competition_data = response.data[0];

        setUser({
          ID: user_backend_data.data[0].id,
          monedas: user_backend_data.data[0].monedas,
          nombre_usuario: user_backend_data.data[0].nombre_usuario,
        });

        setCompetition({
          ID: Competition_data.ID,
          temporada: Competition_data.temporada,
          estado: Competition_data.estado,
          dia: Competition_data.dia,
        });

        ////////////////////////////////////////////////
        ///     SEGÚN ESTADO DE LA COMPETICIÓN      ////
        ////////////////////////////////////////////////
        /// GRUPOS
        if (Competition_data.estado.split(".")[0] >= 1) {
          const teamsResponse = await axios.get(
            `http://localhost:3001/getSomeClubesByCategory/${32}`
          );
          setTeams({ Group_state: teamsResponse.data });
        }
        if (Competition_data.estado.split(".")[0] > 1) {
          fetchGroups(Competition_data.ID, competition_rounds[0].toUpperCase());
        }
        if (Competition_data.estado.split(".")[0] > 2) {
          fetchMathes(Competition_data.ID, competition_rounds[0].toUpperCase());
          fetchPartidosDisponibles(Competition_data.ID);
          if (fechas.octavos == competition.dia) {
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

        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching competition info: ", error);
      setLoading(false);
    }
  }
  const handleBetIncrease = () => {
    if (user.monedas > 0) {
      setSidebar((prevSidebar) => ({
        ...prevSidebar,
        coinBet: sidebar.coinBet + 1,
      }));
    }
  };
  const handleBetDecrease = () => {
    if (sidebar.coinBet > 0) {
      setSidebar((prevSidebar) => ({
        ...prevSidebar,
        coinBet: sidebar.coinBet - 1,
      }));
    }
  };
  const handleBetClose = () => {
    setSidebar({
      open: false,
      matchId: null,
      coinBet: 0,
      odd: 0,
      betChoice: null,
    });
  };
  const handleBetSubmit = (temp_bar) => {
    const bet_status = "ON_GOING"; // ON_GOING | WINNER | LOOSER
    const newBet = {
      match: temp_bar.match,
      amount_bet: temp_bar.coinBet,
      choice: temp_bar.betChoice,
      odd: temp_bar.odd,
      estado_partido: bet_status,
    };
    setBets((prevBets) => [...prevBets, newBet]);
    setSidebar({
      open: false,
      matchId: null,
      coinBet: 0,
      odd: 0,
      betChoice: null,
    });

    setUser({ ...user, monedas: user.monedas - temp_bar.coinBet });
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

    for (let i = 0; i < bets.length; i++) {
      const match_aux = findMatchById(bets[i].match.Idd, bets[i].match.ronda);

      if (match_aux.estado_partido === "FINISHED") {
        console.log("Match  finished");

        let match_result = "";
        if (match_aux.localGoals > match_aux.awayGoals) {
          match_result = "Local";
        } else if (match_aux.localGoals < match_aux.awayGoals) {
          match_result = "Away";
        } else {
          match_result = "Draw";
        }
        let decitiion = "";
        if (bets[i].choice === match_result) {
          temp_notification.apuestas_ganadas++;
          decitiion = `WINNER (+ ${bets[i].amount_bet * bets[i].odd})`;
          cash_won += bets[i].amount_bet * bets[i].odd;
        } else {
          decitiion = "LOOSER";
          temp_notification.apuestas_perdidas++;
        }
        const newBets = [...bets];
        newBets[i].estado_partido = decitiion;
        setBets(newBets);
      } else {
        temp_notification.apuestas_sin_finalizar++;
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
            Group_state: groupByJornada(teamsResponse.data),
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
  const findMatchById = (id, ronda) => {
    console.log("DATOS: ", id, ronda);
    switch (ronda) {
      case competition_rounds[0].toUpperCase():
        console.log("gruuu");
        console.log(matches.Group_state);
        return matches.Group_state.find((match) => match.Idd === id) || null;
        break;
      case competition_rounds[1].toUpperCase():
        return matches.Round_of_16.find((match) => match.Idd === id) || null;
        break;
      case competition_rounds[2].toUpperCase():
        return matches.Round_of_8.find((match) => match.Idd === id) || null;
        break;
      case competition_rounds[3].toUpperCase():
        return matches.Semifinals.find((match) => match.Idd === id) || null;
        break;
      case competition_rounds[4].toUpperCase():
        return matches.Final.find((match) => match.Idd === id) || null;
        break;
      default:
        console.error("Error al encotrar el partido");
        return null;
        break;
    }
  };

  const handleBet = (match, bet_choice) => {
    var odd = 0;
    switch (bet_choice) {
      case "Local":
        odd = match.cuota_local;
        break;
      case "Draw":
        odd = match.cuota_empate;
        break;
      case "Away":
        odd = match.cuota_visitante;
        break;

      default:
        console.error("WARNING: Tipo apuesta no encontrada");
        break;
    }
    setSidebar({ open: true, match, coinBet: 0, odd, betChoice: bet_choice });
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

  const handleMatches = async () => {
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
          var cuotas = makeCuotas(
            groups.Group_state[letra][order[i][0]].category,
            groups.Group_state[letra][order[i][1]].category
          );

          const formattedDate = fech
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

          axios.post(
            "http://localhost:3001/addMatch",
            { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
            {
              local: groups.Group_state[letra][order[i][0]].name,
              visitante: groups.Group_state[letra][order[i][1]].name,
              fecha: formattedDate,
              location: groups.Group_state[letra][order[i][0]].country,
              stadium: groups.Group_state[letra][order[i][0]].stadium,
              grupo: groups.Group_state[letra][order[i][0]].id_grupo,
              cuota_local: cuotas[0],
              cuota_empate: cuotas[1],
              cuota_visitante: cuotas[2],
            }
          );

          cuotas = makeCuotas(
            groups.Group_state[letra][order[i][2]].category,
            groups.Group_state[letra][order[i][3]].category
          );

          axios.post(
            "http://localhost:3001/addMatch",
            { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
            {
              local: groups.Group_state[letra][order[i][2]].name,
              visitante: groups.Group_state[letra][order[i][3]].name,
              fecha: formattedDate,
              location: groups.Group_state[letra][order[i][2]].country,
              stadium: groups.Group_state[letra][order[i][2]].stadium,
              grupo: groups.Group_state[letra][order[i][2]].id_grupo,
              cuota_local: cuotas[0],
              cuota_empate: cuotas[1],
              cuota_visitante: cuotas[2],
            }
          );
        });
        fech.setDate(fech.getDate() + 14);
      }
      await axios.put(
        "http://localhost:3001/updateCompetitionState",
        { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
        {
          value1: competition.ID,
          value2: "3.MATCHED",
        }
      );

      fetchCompetitionInfo();
    } catch (error) {
      console.error("no va: ", error);
    }
  };
  const handleAdvance = async () => {
    if (IdMatchesReadyToPlay <= 0) {
      try {
        const readies = await axios.put(
          "http://localhost:3001/avanzarUnDia",
          { headers: { tokenAcceso: localStorage.getItem("tokenAcceso") } },
          {
            value1: competition.ID,
          }
        );
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

  const handleGroupTeams = async (teamsInRound, teamsPerGroup) => {
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
            {teams.Group_state.map((team) => (
              <p key={team.id}>
                {team.name}, {team.country}
              </p>
            ))}

            <button
              onClick={() => handleGroupTeams(32, 4)}
              disabled={loading || +competition?.estado.split(".")[0] > 1}
            >
              Hacer Grupos
            </button>
          </div>
        );

      case "2":
        return (
          <div>
            <h2>Groups:</h2>
            {Object.keys(groups.Group_state).map((letra, index) => (
              <div key={index}>
                <div
                  onClick={() =>
                    navigate(`/grupo/${letra.split(",")[0]}`, {
                      state: { group: letra.split(",")[0], usuario: user },
                    })
                  }
                >
                  <h3>GRUPO {letra.split(",")[1]}:</h3>
                  {groups.Group_state[letra].map((team, index) => (
                    <div key={index}>
                      - {team.name} - {team.country}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleMatches}
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
                IdMatchesReadyToPlay.length != 0
              }
            >
              Avanzar
            </button>
            {matches.Group_state != [] &&
              matches.Group_state.map((jornada, index) => (
                <div key={index}>
                  <h2>JORNADA {index + 1}:</h2>
                  {jornada.map((match, index) => (
                    <div
                      key={index}
                      className="match-short-container"
                      onClick={() =>
                        navigate(`/partido/${match.Idd}`, {
                          state: { match: match.Idd, usuario: user },
                        })
                      }
                    >
                      <div className="match-short-header">
                        <div className="match-short-place">
                          {match.stadium} in {match.location}
                        </div>
                        <div className="match-short-date">{match.fecha}</div>
                      </div>

                      <div className="match-short-body">
                        <div className="match-short-column">
                          <div className="team-short-name">{match.club_local}</div>
                        </div>

                        <div className="match-short-column">
                          <div className="match-short-score">
                            {match.marcador_local} - {match.marcador_visitante}
                          </div>
                        </div>

                        <div className="match-short-column">
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
              disabled={loading || +competition?.estado.split(".")[0] != 4}
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
                IdMatchesReadyToPlay.length != 0
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

      // Add cases for other states...

      default:
        return <p>NO INFO TO SHOW YET</p>;
    }
  };

  const renderNavbar = () => {
    return (
      <div>
        {competition_statuses.map((state, index) => (
          <button
            key={index}
            onClick={() => setCurrentSection(state)}
            disabled={
              loading ||
              +state.split(".")[0] > +competition?.estado.split(".")[0]
            }
          >
            {state}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Layout>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {user && (
              <div>
                <p>Nombre: {user?.nombre_usuario}</p>
                <p>Monedas: {user?.monedas}</p>
              </div>
            )}
            <button onClick={openBetCard}>Ver Apuestas</button>
            {betCard && (
              <div className="popup">
                <div className="popup-inner">
                  <div className="bets">
                    {bets.map((bet, index) => (
                      <div key={index} className="bet">
                        <h2>
                          Match: {bet.match.club_local} vs{" "}
                          {bet.match.club_visitante}
                        </h2>
                        <p>Bet Amount: {bet.amount_bet}</p>
                        <p>
                          Choice: {bet.choice} ({bet.odd})
                        </p>
                        <p>Estado apuesta: {bet.estado_partido}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={checkBetResults}>CHECK BET RESULTS</button>
                  <button onClick={closeBetCard}>CERRAR</button>
                </div>
              </div>
            )}

            {competition && (
              <div>
                <p>Season: {competition?.temporada}</p>
                <p>State: {competition?.estado}</p>
                <h2>
                  DIA: <p>{competition?.dia}</p>
                </h2>
                {renderNavbar()}
                {renderContent()}
              </div>
            )}
          </>
        )}
        {sidebar.open && (
          <div className="popup">
            <div className="popup-inner">
              <h2>
                En partido: {sidebar.match.club_local} vs{" "}
                {sidebar.match.club_visitante}
              </h2>
              <p>Bet Amount: {sidebar.coinBet}</p>
              <p>
                {" "}
                CHOICE: {sidebar.betChoice} ({sidebar.odd}){" "}
              </p>
              <button onClick={handleBetIncrease}>+</button>
              <button onClick={handleBetDecrease}>-</button>
              <p>Potential win: {sidebar.coinBet * sidebar.odd}</p>
              <button
                onClick={() => handleBetSubmit(sidebar)}
                disabled={sidebar.match.estado_partido === "ENDED"}
              >
                Confirm Bet
              </button>
              <button onClick={handleBetClose}>Cancel</button>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default Inicio;
