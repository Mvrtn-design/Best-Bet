const express = require("express");
const router = express.Router();

const { tokenValido } = require("../middleware/middleAutentication");

const main_controller = require("../controller/main_controller");
const usuario_controller = require("../controller/user_controller");
const partida_controller = require("../controller/partida_controller");
const competicion_controller = require("../controller/competicion_controller");
const match_controller = require('../controller/match_controller');
const grupo_controller = require('../controller/grupo_controller');
const club_controller = require('../controller/club_controller');
const bet_controller = require('../controller/bet_controller');

/////////       MAIN            ///////////
router.get("/getClubes", main_controller.getClubes);
router.get("/getClubNames", main_controller.getClubNames);
router.get("/getClubByName/:name", main_controller.getClubByName);
router.get("/getSomeClubesByCategory/:cantidadClubes", main_controller.getSomeClubesByCategory);
router.post("/storeClubsJSON", main_controller.storeClubsJSON);

/////////       BET             ///////////
router.post("/addTicket", bet_controller.addTicket);
router.post("/addBet", bet_controller.addBet);
router.put("/updateEstadoTicket/:id", bet_controller.cambiarEstadoTicket);
router.get("/getLiveBetsByCompeticion/:id", bet_controller.getLiveBetsByCompeticion);

/////////       CLUB            ///////////
router.get("/getClubsByCountry", club_controller.clubsByCountry);
router.get("/getOtherClubs", club_controller.otherClubs);
router.get("/getClubsByCompetition", club_controller.getClubsByCompetition);
router.get("/getFromPage", club_controller.getFromPage);
router.get("/getTeamsNumber", club_controller.getTeamsNumber);

/////////       PARTIDA            ///////////
router.post("/addPartida", partida_controller.crearPartida);
router.get("/getPartidas", partida_controller.listaPartidas);
router.get("/getPartida/:id", partida_controller.getPartidaByID);
router.get("/getUSerByPartida/:id", tokenValido, partida_controller.getUSerByPartida);


/////////       COMPETITION            ///////////
router.get("/getMatchesByCompetition", competicion_controller.getMatchesByCompetition);
router.get("/getCompeticion/:id", competicion_controller.getCompeticionByID);
router.get("/getGroupsByCompetition", competicion_controller.getGroupsByCompetition);
router.get("/getTeamNamesByIDpartido/:id", competicion_controller.getTeamNamesByIDpartido);
router.get("/getCompeticionByPartida/:id", competicion_controller.getCompeticionByPartida);
router.get("/getCompeticionByUser/:id", competicion_controller.getCompeticionesByUser);
router.post("/addGroup", competicion_controller.guardarGrupo);
router.post("/addMatch", competicion_controller.guardarPartido);
router.post("/addEquipoToGroup", competicion_controller.addEquipoToGroup);
router.post("/addCompeticion", competicion_controller.crearCompeticion);
router.put("/updateCompetitionState", competicion_controller.updateCompetitionState);
router.put("/avanzarUnDia", competicion_controller.avanzarUnDia);
router.put("/getClubesByCompetition", competicion_controller.getClubesByCompetition);
router.get("/eliminarCompeticion", competicion_controller.eliminarCompeticion);
router.put("/setCompetitionCoins/:id", usuario_controller.actualizarMonedas);

/////////       USUARIO            ///////////
router.get("/login", usuario_controller.irInicioSesion);
router.get("/setIn", usuario_controller.irRegistrarse);
router.get("/getUsers", usuario_controller.listaUsuarios);
router.get("/get1user", tokenValido, usuario_controller.unUsuario);
router.get("/getLogUser", tokenValido, usuario_controller.usuario_logueado);
router.get("/delete/:id", usuario_controller.eliminarUsuario);
router.get("/edit/:id", usuario_controller.verUsuarioEditar);
router.post("/add", usuario_controller.guardarUsuario);
router.post("/update/:id", usuario_controller.editarUsuario);
router.get("/check", usuario_controller.checkUsuario);
router.get("/auth", tokenValido, usuario_controller.usuario_autenticado);


/////////       PARTIDO            ///////////
router.get("/getPartidoById/:id", match_controller.getMatchByID);
router.put("/partidoDisponible", match_controller.partidoDisponible);
router.get("/checkPartidosDisponibles/:id", match_controller.checkPartidosDisponibles);
router.put("/updateResultadoPartido/:id", match_controller.updateResultadoPartido);
router.put("/updateEstadisticasEquipo/:club/:id_group", match_controller.updateEstadisticasEquipo);

/////////       GRUPO            ///////////
router.get("/getGrupoById/:id", grupo_controller.getGrupoByID);

module.exports = router;
