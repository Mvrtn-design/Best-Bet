const controller = {};

controller.getMatchByID = (req, res) => {
  const idd = req.params.id;
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query("SELECT * FROM partido WHERE IDD = ?", idd, (err, partido) => {
      if (err) {
        console.error("Fallo al get partido debido a: ", err);
      }
      console.log("Partido encontrado");
      res.json(partido);
    });
  });
};

controller.partidoDisponible = (req, res) => {
  const idd = req.body.value1.Idd;
  console.log("iiii: ", idd);

  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      `UPDATE partido SET estado_partido = "READY_TO_PLAY" WHERE IDD = ? `,
      [idd],
      (errr, estado) => {
        if (errr) {
          res.json(errr); //manejar los errores con next (mas profesional)
        }
        console.log("eeeee: ", estado);
        res.json(estado);
      }
    );
  });
};

controller.updateResultadoPartido = (req, res) => {
  const idd = req.params.id;
  const golesLocal = req.body.value1;
  const golesVisitante = req.body.value2;
  const estado_partido = req.body.value1;
  console.log("valor de value1: ", golesLocal);
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query(
      `UPDATE estadisticas join partido on id_group = id_grupo where SET marcador_local = ? WHERE IDD = ? `,
      [golesLocal,idd],
      (err, partido) => {
        if (err) {
          console.error("Fallo al get partido debido a: ", err);
        }
        console.log("DISPUTADO");
        res.json(partido);
      }
    );
  });
};

controller.checkPartidosDisponibles = (req, res) => {
  const idd = req.params.id;
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query(
      "SELECT Idd FROM partido WHERE date(fecha) = (SELECT date(dia) FROM competicion WHERE ID = ?)",
      idd,
      (err, partido) => {
        if (err) {
          console.error("Fallo al get partido debido a: ", err);
        }
        console.log("Partidos: ", partido);
        res.json(partido);
      }
    );
  });
};

module.exports = controller;
