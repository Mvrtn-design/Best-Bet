import "./App.css";
import "./pages/partials/Navbar.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AuthContext } from "./helpers/AuthContext";
import React, { useEffect, useState } from 'react';
import axios from "axios";

import Main from "./pages/Main";
import Login from "./pages/Login";
import Clubs from "./pages/Clubs";
import Match from "./pages/Match";
import SetUp from "./pages/SetUp";
import Users from "./pages/users";
import Torneo from "./pages/NewTorneo";
import Menu from "./pages/Inicio-partida";
import Match_Info from "./pages/Match-Info";
import Grupo from "./pages/Grupo";
import Tempp from "./pages/Tempp";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";
import FAQ from "./pages/FAQ";

function App() {
  const [authState, setAuthState] = useState({username: "",id: 0, status:false});

  useEffect(() => {
    axios.get('http://localhost:3001/auth', { headers: { tokenAcceso: localStorage.getItem('tokenAcceso') } }).then((response) => {
      if (response.data.error) {
        setAuthState({...authState , status: false});
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status:true});
      }
    })
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" exact Component={Main}></Route>
            <Route path="/login" exact Component={Login}></Route>
            <Route path="/match" exact Component={Match}></Route>
            <Route path="/clubs" exact Component={Clubs}></Route>
            <Route path="/setUp" exact Component={SetUp}></Route>
            <Route path="/users" exact Component={Users}></Route>
            <Route path="/profile" exact Component={Profile}></Route>
            <Route path="/torneo" exact Component={Torneo}></Route>
            <Route path="/createPost" exact Component={CreatePost}></Route>
            <Route path="/tempp" exact Component={Tempp}></Route>
            <Route path="/menu/:idPartida/:idCompeticion" element={<Menu />}></Route>
            <Route path="/partido/:id_match" element={<Match_Info />}></Route>
            <Route path="/grupo/:id_group" element={<Grupo />}></Route>
            <Route path="/faq" exact Component={FAQ}></Route>
            
            <Route path="*"exact Component={PageNotFound}></Route>
          </Routes>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
