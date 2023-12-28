import React from "react";
import Layout from "./partials/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function Match_Info() {
  const  {id_match}  = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchInfo();
  }, [id_match]);

  const fetchMatchInfo = async () => {
    console.log("GETTING INFO");
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/getMatchByID/${id_match}`
      );

      const match_data = response.data[0];

      setMatch(match_data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching match info: ", error);
      setLoading(false);
    }
  };
  return (
    <Layout>
      {loading && <p>Loading...</p>}

      {match && (
        <div>          
          <h1>
            {match.club_local} {match.marcador_local == null && <i> </i>}-{match.marcador_visitante == null && <i> </i>}{match.club_visitante}
          </h1>
          <p>
            - {match.stadium} in {match.location}
          </p>
          <p>- {match.fecha}</p>{" "}
        </div>
      )}
    </Layout>
  );
}

export default Match_Info;
