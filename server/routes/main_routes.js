const express = require("express");
const router = express.Router();

const main_controller = require("../controller/main_controller");
const usuario_controller = require("../controller/user_controller");
const partida_controller = require("../controller/partida_controller");
const competicion_controller = require("../controller/competicion_controller");

router.get("/getClubes", main_controller.getClubes);
router.get("/getClubNames", main_controller.getClubNames);
router.get("/getClubInfo/:id", main_controller.getClubById);
router.get("/getClubByName/:name", main_controller.getClubByName);
router.get("/getSomeClubesByCategory/:cantidadClubes", main_controller.getSomeClubesByCategory);
router.get("/getClubInfo/:id", main_controller.getClubById);
router.post("/storeClubsJSON", main_controller.storeClubsJSON);

router.post("/addPartida", partida_controller.crearPartida);
router.get("/getPartidas", partida_controller.listaPartidas);
router.get("/getPartida/:id", partida_controller.getPartidaByID);

router.post("/addCompeticion", competicion_controller.crearCompeticion);
router.get("/getCompeticion/:id", competicion_controller.getCompeticionByID);
router.get("/getCompeticionByPartida/:id", competicion_controller.getCompeticionByPartida);
router.get("/getCompeticionByUser/:id", competicion_controller.getCompeticionesByUser);
router.post("/addGroup", competicion_controller.guardarGrupo);
router.post("/addEquipoToGroup", competicion_controller.addEquipoToGroup);
router.get("/getGroupsByCompetition", competicion_controller.getGroupsByCompetition);
router.put("/updateCompetitionState", competicion_controller.updateCompetitionState);


router.get("/login", usuario_controller.irInicioSesion);
router.get("/setIn", usuario_controller.irRegistrarse);
router.get("/getUsers", usuario_controller.listaUsuarios);
router.get("/get1user", usuario_controller.unUsuario);
router.post("/add", usuario_controller.guardarUsuario);
router.get("/delete/:id", usuario_controller.eliminarUsuario);
router.get("/edit/:id", usuario_controller.verUsuarioEditar);
router.post("/update/:id", usuario_controller.editarUsuario);

module.exports = router;
