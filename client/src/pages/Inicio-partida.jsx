import React from "react";
import Layout from "./partials/Layout";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const Inicio = () => {
  const competition_statuses = [
    "1.CREADO",
    "2.GROUPED",
    "3.MATCHED",
    "4.ROUND_OF_16",
    "5.ROUND_OF_16-GROUPED",
    "6.ROUND_OF_16-MATCHED",
    "7.ROUND_OF_8-TEAMS",
    "8.ROUND_OF_8-MATCHED",
    "9.SEMIFINALS-TEAMS",
    "10.SEMIFINALS-MATCHED",
    "11.FINAL-TEAMS",
    "12.FINAL-MATCHED",
    "14.ENDED",
  ];
  const competition_rounds = [
    "Group_state",
    "Round_of_16",
    "Round_of_8",
    "Semifinals",
    "Final",
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
    Champions: [],
  });
  const [user, setUSer] = useState({
    ID: 0,
    nombre_usuario: 0,
    monedas: 0,
  });
  const [matches, setMatches] = useState([]);
  const [groups, setGroups] = useState({
    Group_state: {},
    Round_of_16: {},
    Round_of_8: {},
    Semifinals: {},
    Final: {},
  });
  const [currentSection, setCurrentSection] = useState(competition_statuses[0]);
  const [loading, setLoading] = useState(true);
  const [IdMatchesReadyToPlay, setIdMatchesReadyToPlay] = useState([]);
  const fechaOctavos = new Date("2023-12-01T00:00:00")
    .toISOString()
    .slice(0, 24);

  ////////              FUNCTIONS         ////////////
  useEffect(() => {
    fetchCompetitionInfo();
  }, [loading]);

  async function fetchCompetitionInfo() {
    console.log("GETTING COMPETITION INFO");
    try {
      setLoading(true);
      const user_backend_data = await axios.get(
        `http://localhost:3001/getUSerByPartida/${idPartida}`
      );
      const response = await axios.get(
        `http://localhost:3001/getCompeticionByPartida/${idPartida}`
      );

      const Competition_data = response.data[0];

      setUSer({
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
      ///   SEGÚN ESTADO DE LA COMPETICIÓN      //////
      ////////////////////////////////////////////////

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
        fetchGroupMathes(Competition_data.ID);
        fetchPartidosDisponibles(Competition_data.ID);
        if (fechaOctavos == competition.dia) {
          setRound16();
        }
      }
      if (Competition_data.estado.split(".")[0] > 3) {
        const oct = await fetchOctavosFinal();
        setTeams((prevDict) => ({ ...prevDict, Round_of_16: oct }));
      }
      if (Competition_data.estado.split(".")[0] > 4) {
        fetchGroups(Competition_data.ID, competition_rounds[1].toUpperCase());
        console.log(groups);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching competition info: ", error);
      setLoading(false);
    }
  }

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

  const setRound16 = async () => {
    await axios.put("http://localhost:3001/updateCompetitionState", {
      value1: competition.ID,
      value2: "4.ROUND_OF_16",
    });
    console.log("ESTAMOS EN OCTAVOS");
  };

  const fetchPartidosDisponibles = async (id_competicion) => {
    try {
      const avaliables = await axios.get(
        `http://localhost:3001/checkPartidosDisponibles/${id_competicion}`
      );
      setIdMatchesReadyToPlay(avaliables.data);
      //console.log("Readys: ", IdMatchesReadyToPlay);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGroups = async (id_competicion, round) => {
    console.log("RONDA: ", round);
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
      const aaa = groupByLetra(teamsResponse.data);
      switch (round) {
        case competition_rounds[0].toUpperCase():
          setGroups((prevDict) => ({ ...prevDict, Group_state: aaa }));
          break;
        case competition_rounds[1].toUpperCase():
          setGroups((prevDict) => ({ ...prevDict, Round_of_16: aaa }));
          break;
        case competition_rounds[2].toUpperCase():
          setGroups((prevDict) => ({ ...prevDict, Round_of_8: aaa }));
          break;
        case competition_rounds[3].toUpperCase():
          setGroups((prevDict) => ({ ...prevDict, Semifinals: aaa }));
          break;
        case competition_rounds[4].toUpperCase():
          setGroups((prevDict) => ({ ...prevDict, Final: aaa }));
          break;

        default:
          console.error("Numero de equipos a agrupar erroneo");
          break;
      }

      setGroups((prevDict) => ({ ...prevDict, Group_state: aaa }));
    } catch (error) {
      console.error("Error generando los grupos:", error);
    }
  };

  const fetchGroupMathes = async (id_competicion) => {
    try {
      const teamsResponse = await axios.get(
        "http://localhost:3001/getMatchesByCompetition",
        {
          params: {
            value1: id_competicion,
            value2: competition_rounds[0].toUpperCase(),
          },
        }
      );
      const backend_matches_group_states = groupByJornada(teamsResponse.data);
      setMatches(backend_matches_group_states);
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

          axios.post("http://localhost:3001/addMatch", {
            local: groups.Group_state[letra][order[i][0]].name,
            visitante: groups.Group_state[letra][order[i][1]].name,
            fecha: formattedDate,
            location: groups.Group_state[letra][order[i][0]].country,
            stadium: groups.Group_state[letra][order[i][0]].stadium,
            grupo: groups.Group_state[letra][order[i][0]].id_grupo,
            cuota_local: cuotas[0],
            cuota_empate: cuotas[1],
            cuota_visitante: cuotas[2],
          });

          cuotas = makeCuotas(
            groups.Group_state[letra][order[i][2]].category,
            groups.Group_state[letra][order[i][3]].category
          );

          axios.post("http://localhost:3001/addMatch", {
            local: groups.Group_state[letra][order[i][2]].name,
            visitante: groups.Group_state[letra][order[i][3]].name,
            fecha: formattedDate,
            location: groups.Group_state[letra][order[i][2]].country,
            stadium: groups.Group_state[letra][order[i][2]].stadium,
            grupo: groups.Group_state[letra][order[i][2]].id_grupo,
            cuota_local: cuotas[0],
            cuota_empate: cuotas[1],
            cuota_visitante: cuotas[2],
          });
        });
        fech.setDate(fech.getDate() + 14);
      }
      await axios.put("http://localhost:3001/updateCompetitionState", {
        value1: competition.ID,
        value2: "3.MATCHED",
      });

      fetchCompetitionInfo();
    } catch (error) {
      console.log("no va: ", error);
    }
  };
  const handleAdvance = async () => {
    setLoading(true);
    if (IdMatchesReadyToPlay <= 0) {
      try {
        const readies = await axios.put("http://localhost:3001/avanzarUnDia", {
          value1: competition.ID,
        });
        setIdMatchesReadyToPlay(readies.data);
        console.log("Readys: ", readies.data);
        readies.data.forEach(async (element) => {
          await axios.put("http://localhost:3001/partidoDisponible", {
            value1: element.Idd,
          });
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
      {
        value1: marcador_local,
        value2: marcador_visitante,
        value3: estado_partido,
      }
    );

    //Local
    await axios.put(
      `http://localhost:3001/updateEstadisticasEquipo/${local}/${id_group}`,
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
        ronda = "GROUP_STATES";
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
      setLoading(true);
      // Randomly sort the teams and group them into 8 groups with 4 teams each

      const shuffledTeams = round_teams.sort(() => 0.5 - Math.random());

      const groupSize = teamsPerGroup;
      const groupedTeams = [];

      for (let index = 0; index < shuffledTeams.length / groupSize; index++) {
        let letra = String.fromCharCode(65 + index);

        //POST GROUP
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

          //POST TEAM
          await axios.post("http://localhost:3001/addEquipoToGroup", {
            value1: backend_id_group,
            value2: team_aux.name,
          });
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

      await axios.put("http://localhost:3001/updateCompetitionState", {
        value1: competition.ID,
        value2: competition_statuses[competition.estado.split(".")[0]],
      });

      fetchCompetitionInfo();
    } catch (error) {
      console.error("Error grouping teams:", error);
    }
  };

  ////////        EXECUTION         //////////////

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
              onClick={() => handleGroupTeams("Group_state", 4)}
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
              disabled={loading || +competition?.estado.split(".")[0] !== 3}
            >
              Avanzar
            </button>
            {matches != [] &&
              matches.map((jornada, index) => (
                <div key={index}>
                  <h2>JORNADA {index + 1}:</h2>
                  {jornada.map((match, index) => (
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
              onClick={handleMatches}
              disabled={loading || +competition?.estado.split(".")[0] > 4}
            >
              Generar Partidos
            </button>
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
      </Layout>
    </div>
  );
};

export default Inicio;
