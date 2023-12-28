import React from "react";
import Layout from "./partials/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const Inicio = () => {
  const { idPartida } = useParams();
  const [competition, setCompetition] = useState({
    ID: 0,
    estado: 0,
    temporada: 0,
  });
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [groups, setGroups] = useState({});
  const [currentSection, setCurrentSection] = useState("1.CREADO");
  const [loading, setLoading] = useState(true);

  ////////              FUNCTIONS         ////////////
  useEffect(() => {
    fetchCompetitionInfo();
  }, [idPartida]);
  const fetchCompetitionInfo = async () => {
    console.log("GETTING INFO");
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/getCompeticionByPartida/${idPartida}`
      );

      const Competition_data = response.data[0];

      setCompetition({
        ID: Competition_data.ID,
        temporada: Competition_data.temporada,
        estado: Competition_data.estado,
      });
      console.log("number: ", Competition_data.estado.split(".")[0]);

      if (Competition_data.estado.split(".")[0] >= 1) {
        const teamsResponse = await axios.get(
          `http://localhost:3001/getSomeClubesByCategory/${32}`
        );
        setTeams(teamsResponse.data);
      }
      if (Competition_data.estado.split(".")[0] > 1) {
        fetchGroups(Competition_data.ID);
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
  const handleMatches = async () => {
    const matches = [];
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
      
      const matchday = [];
      for (let i = 0; i < order.length; i++) {
        const groupMatches = [];
        Object.keys(groups).map((letra, index) => {
          var localTeam = groups[letra][order[i][0]].name;
          var awayTeam = groups[letra][order[i][1]].name;
          var location = groups[letra][order[i][0]].country;
          var stadium = groups[letra][order[i][0]].stadium;
          var id_group = groups[letra][order[i][0]].id_grupo;
          var fecha = fech.toString();
          groupMatches.push({
            localTeam,
            awayTeam,
            location,
            stadium,
            id_group,
            fecha,
          });
          fech.setDate(fech.getDate()+1);

          localTeam = groups[letra][order[i][2]].name;
          awayTeam = groups[letra][order[i][3]].name;
          location = groups[letra][order[i][2]].country;
          stadium = groups[letra][order[i][2]].stadium;
          id_group = groups[letra][order[i][2]].id_grupo;
          var fecha = fech.toString();

          groupMatches.push({
            localTeam,
            awayTeam,
            location,
            stadium,
            id_group,
            fecha,
          });
          fech.setDate(fech.getDate()-1);
        });
        matchday.push(groupMatches);
        fech.setDate(fech.getDate()+14);
        
      }
      matches.push(matchday);
      setMatches(matchday);
      console.log(matchday);
    } catch (error) {
      console.log("no va: ", error);
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
            value2: team_aux.ID,
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
    switch (currentSection) {
      case "1.CREADO":
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

      case "2.GROUPED":
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
            <button onClick={handleMatches} disabled={loading}>
              Another Button
            </button>
            {matches != [] &&
              matches.map((jornada, index) => (
                <div key={index}>
                  <h2>JORNADA {index+1}:</h2>
                  {jornada.map((match, index) => (
                    <div key={index}>
                      <h3>{match.localTeam} - {match.awayTeam}</h3> 
                      <p>- {match.stadium} in {match.location}</p>
                      <p>- {match.fecha}</p>
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
      "10.GROUP-STATE DAY 6",
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

        {competition && (
          <div>
            <p>Season: {competition?.temporada}</p>
            <p>State: {competition?.estado}</p>
            {renderNavbar()}
            {renderContent()}
          </div>
        )}
      </Layout>
    </div>
  );
};

export default Inicio;
