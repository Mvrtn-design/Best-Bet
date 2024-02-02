import "./App.css";
import "./pages/partials/Navbar.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

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

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact Component={Main}></Route>
          <Route path="/login" exact Component={Login}></Route>
          <Route path="/match" exact Component={Match}></Route>
          <Route path="/clubs" exact Component={Clubs}></Route>
          <Route path="/setUp" exact Component={SetUp}></Route>
          <Route path="/users" exact Component={Users}></Route>
          <Route path="/torneo" exact Component={Torneo}></Route>
          <Route path="/menu/:idPartida/:idCompeticion" element={<Menu />}></Route>
          <Route path="/partido/:id_match" element={<Match_Info />}></Route>
          <Route path="/grupo/:id_group" element={<Grupo />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
