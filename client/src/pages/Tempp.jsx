import { React, useEffect } from 'react';
import axios from "axios";

function Tempp() {

  const getFromPage = ((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

  async function getData() {

    const teamsResponse = axios.get("http://localhost:3001/getFromPage");
    console.log(teamsResponse);
    return (
      <p>{teamsResponse}</p>
    )
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>tt</div>
  )
}

export default Tempp