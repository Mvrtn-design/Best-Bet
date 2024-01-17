import React from "react";
import Layout from "./partials/Layout";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const Inicio = () => {
  const navigate = useNavigate();
  const { idPartida } = useParams();
  const [competition, setCompetition] = useState({
    ID: 0,
  });
  const [teams, setTeams] = useState([]);
  const [user, setUSer] = useState({
    ID: 0,
    nombre_usuario: 0,
    monedas: 0,
  });
  const [matches, setMatches] = useState([]);
  const [groups, setGroups] = useState({});
  const [currentSection, setCurrentSection] = useState("1.CREADO");
  const [loading, setLoading] = useState(true);
  const IdMatchesReadyToPlay = [];

  ////////              FUNCTIONS         ////////////
  useEffect(() => {
    fetchCompetitionInfo();
  }, [idPartida]);

  const fetchCompetitionInfo = async () => {
    console.log("GETTING INFO");
    try {
      setLoading(true);
      const responseUser = await axios.get(
        `http://localhost:3001/getUSerByPartida/${idPartida}`
      );
      const response = await axios.get(
        `http://localhost:3001/getCompeticionByPartida/${idPartida}`
      );
      const user_data = responseUser.data[0];
      const Competition_data = response.data[0];
      console.log(Competition_data);

      setUSer({
        ID: user_data.id,
        monedas: user_data.monedas,
        nombre_usuario: user_data.nombre_usuario,
      });

      setCompetition({
        ID: Competition_data.ID,
        temporada: Competition_data.temporada,
        estado: Competition_data.estado,
        dia: Competition_data.dia,
      });

      if (Competition_data.estado.split(".")[0] >= 1) {
        const teamsResponse = await axios.get(
          `http://localhost:3001/getSomeClubesByCategory/${32}`
        );
        setTeams(teamsResponse.data);
      }
      if (Competition_data.estado.split(".")[0] > 1) {
        fetchGroups(Competition_data.ID);
      }
      if (Competition_data.estado.split(".")[0] > 2) {
        fetchGroupMathes(Competition_data.ID);
        fetchMatches();
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching competition info: ", error);
      setLoading(false);
    }
  };

  function groupByLetra(equipos) {
    return equipos.reduce((groups, item) => {
      const groupName = item.letra;

      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      groups[groupName].push(item);
      return groups;
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

  const fetchGroups = async (id_competicion) => {
    try {
      const teamsResponse = await axios.get(
        "http://localhost:3001/getGroupsByCompetition",
        {
          params: { value1: id_competicion, value2: "GROUP_STATE" },
        }
      );
      const aaa = groupByLetra(teamsResponse.data);
      setGroups(aaa);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchGroupMathes = async (id_competicion) => {
    try {
      const teamsResponse = await axios.get(
        "http://localhost:3001/getMatchesByCompetition",
        {
          params: { value1: id_competicion, value2: "GROUP_STATE" },
        }
      );

      const aaa = groupByJornada(teamsResponse.data);

      setMatches(aaa);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  function makeCuotas(local_cat, away_cat) {
    const results = [];
    for (let index = 0; index < 3; index++) {
      let num = Math.random() * (1.9 - 1.1) + 1.1;
      results.push(parseFloat(num).toFixed(2));
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
        Object.keys(groups).map(async (letra) => {
          var location = groups[letra][order[i][0]].country;
          var stadium = groups[letra][order[i][0]].stadium;
          var id_group = groups[letra][order[i][0]].id_grupo;
          var cuotas = makeCuotas(
            groups[letra][order[i][0]].category,
            groups[letra][order[i][1]].category
          );

          const formattedDate = fech
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

          await axios.post("http://localhost:3001/addMatch", {
            local: groups[letra][order[i][0]].name,
            visitante: groups[letra][order[i][1]].name,
            fecha: formattedDate,
            location: location,
            stadium: stadium,
            grupo: id_group,
            cuota_local: cuotas[0],
            cuota_empate: cuotas[1],
            cuota_visitante: cuotas[2],
          });

          location = groups[letra][order[i][2]].country;
          stadium = groups[letra][order[i][2]].stadium;
          id_group = groups[letra][order[i][2]].id_grupo;
          cuotas = makeCuotas(
            groups[letra][order[i][2]].category,
            groups[letra][order[i][3]].category
          );

          const formattedDate2 = fech
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

          await axios.post("http://localhost:3001/addMatch", {
            local: groups[letra][order[i][2]].name,
            visitante: groups[letra][order[i][3]].name,
            fecha: formattedDate2,
            location: location,
            stadium: stadium,
            grupo: id_group,
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
        console.log(competition);

        const readies = await axios.put("http://localhost:3001/avanzarUnDia", {
          value1: competition.ID,
        });
        IdMatchesReadyToPlay = readies.data;
        for (let index = 0; index < IdMatchesReadyToPlay.length; index++) {
          await axios.put("http://localhost:3001/partidoDisponible", {
          value1: index,
        });
        }
        fetchCompetitionInfo();
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Quedan partidos por simular: ", IdMatchesReadyToPlay.length());
    }
  };

  const handleGroupTeams = async () => {
    try {
      setLoading(true);
      // Randomly sort the teams and group them into 8 groups with 4 teams each
      const shuffledTeams = teams.sort(() => 0.5 - Math.random());

      const groupSize = 4;
      const groupedTeams = [];

      for (let index = 0; index < shuffledTeams.length / groupSize; index++) {
        let letra = String.fromCharCode(65 + index);
        let ronda = "GROUP_STATE";

        //POST GROUP
        const groupResponse = await axios.post(
          "http://localhost:3001/addGroup",
          {
            value1: competition.ID,
            value2: ronda,
            value3: letra,
          }
        );
        const response = groupResponse.data;

        for (let j = 0; j < groupSize; j++) {
          const team_aux = shuffledTeams[index * groupSize + j];

          //POST TEAM
          await axios.post("http://localhost:3001/addEquipoToGroup", {
            value1: response,
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
      setGroups(groupedTeams);

      await axios.put("http://localhost:3001/updateCompetitionState", {
        value1: competition.ID,
        value2: "2.GROUPED",
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
            {teams.map((team) => (
              <p key={team.id}>
                {team.name}, {team.country}
              </p>
            ))}

            <button
              onClick={handleGroupTeams}
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
            {Object.keys(groups).map((letra, index) => (
              <div key={index}>
                <h3>GRUPO {letra}:</h3>
                {groups[letra].map((team, index) => (
                  <div key={index}>
                    - {team.name} - {team.country}
                  </div>
                ))}
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
            <h2>PARTIDOS:</h2>
            <button
              onClick={handleAdvance}
              disabled={loading || +competition?.estado.split(".")[0] > 3}
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
                          {match.club_local} - {match.club_visitante}
                        </h3>
                        <p>
                          - {match.stadium} in {match.location}
                        </p>
                        <p>- {match.fecha}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        );

      // Add cases for other states...

      default:
        return <p>NOT HERE YET</p>;
    }
  };

  const renderNavbar = () => {
    const statess = [
      "1.CREADO",
      "2.GROUPED",
      "3.MATCHED",
      "4.GROUP-STATE DAY 1",
      "5.GROUP-STATE DAY 2",
      "6.GROUP-STATE DAY 3",
      "7.GROUP-STATE DAY 4",
      "8.GROUP-STATE DAY 5",
      "9.GROUP-STATE DAY 6",
      "10.MATCHED-2",
      "14.FINAL",
    ];
    return (
      <div>
        {statess.map((state, index) => (
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
        {loading && <p>Loading...</p>}
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
      </Layout>
    </div>
  );
};

export default Inicio;
