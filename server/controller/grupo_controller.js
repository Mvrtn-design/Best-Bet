const controller = {};

controller.getGrupoByID = (req, res) => {
    const idd = req.params.id;
    req.getConnection((err, conn) => {
      if (err) {
        console.error("Error al establecer la conexion");
      }
      conn.query("select * from club join estadisticas on club.name = estadisticas.nombre_equipo  join grupo on estadisticas.id_grupo = grupo.ID   where grupo.ID = ?", idd, (err, grupo) => {
        if (err) {
          console.error("Fallo al get grupo debido a: ", err);
        }
        console.log("Grupo encontrado");
        res.json(grupo);
      });
    });
  };

module.exports = controller;
