const controller = {};

controller.getMatchByID = (req, res) => {
  const idd = req.params.id;
  console.log("recibo id: ", idd);
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
  const idd = req.body.value1;

  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      `UPDATE partido SET estado = "READY_TO_PLAY" WHERE IDD = ? `,
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

module.exports = controller;
