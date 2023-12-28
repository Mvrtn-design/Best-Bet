const controller = {};

controller.getMatchByID = (req, res) => {
  const idd = req.params.id;
  console.log("recibo id: ",idd);
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query("SELECT * FROM partido WHERE ID = ?", idd, (err, partido) => {
      if (err) {
        console.error("Fallo al get partido debido a: ", err);
      }
      console.log("Partido encontrado");
      console.log(partido);
      res.json(partido);
    });
  });
};

module.exports = controller;
