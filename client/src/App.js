import "./App.css";
import "./pages/partials/Navbar.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthContext } from "./helpers/AuthContext";
import React, { useEffect, useState } from 'react';
import axios from "axios";

import Main from "./pages/Main";
import Grupo from "./pages/Grupo";
import Login from "./pages/Login";
import Clubs from "./pages/Clubs";
import Match from "./pages/Match";
import SetUp from "./pages/SetUp";
import Torneo from "./pages/NewTorneo";
import Profile from "./pages/Profile";
import Menu from "./pages/Inicio-partida";
import CreatePost from "./pages/CreatePost";
import MatchInfo from "./pages/Match-Info";
import PageNotFound from "./pages/PageNotFound";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cookies from "./pages/partials/Cookies";
import Privacidad from "./pages/partials/Privacidad";
import Terminos from "./pages/partials/Terminos";
import getAPI_URL from "./helpers/api_url";

function App() {
  const [authState, setAuthState] = useState({ username: "", id: 0, status: false });

  useEffect(() => {
    axios.get(`${getAPI_URL()}/auth`, { headers: { tokenAcceso: localStorage.getItem('tokenAcceso') } }).then((response) => {
      if (response.data.error) {
        setAuthState({ ...authState, status: false });
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true
        });
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
            <Route path="/profile" exact Component={Profile}></Route>
            <Route path="/torneo" exact Component={Torneo}></Route>
            <Route path="/createPost" exact Component={CreatePost}></Route>
            <Route path="/menu/:idPartida/:idCompeticion" element={<Menu />}></Route>
            <Route path="/partido/:id_match" element={<MatchInfo />}></Route>
            <Route path="/grupo/:id_group" element={<Grupo />}></Route>
            <Route path="/faq" exact Component={FAQ}></Route>
            <Route path="/about" exact Component={About}></Route>
            <Route path="/contact" exact Component={Contact}></Route>
            <Route path="/terms-and-conditions" exact Component={Terminos}></Route>
            <Route path="/privacy" exact Component={Privacidad}></Route>
            <Route path="/cookies" exact Component={Cookies}></Route>

            <Route path="*" exact Component={PageNotFound}></Route>
          </Routes>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
