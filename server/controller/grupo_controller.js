const controller = {};

controller.getGrupoByID = (req, res) => {
  const idd = req.params.id;
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query("SELECT * FROM club JOIN estadisticas ON club.name = estadisticas.nombre_equipo  JOIN grupo on estadisticas.id_grupo = grupo.ID   where grupo.ID = ? order by puntos DESC, goles_a_favor DESC", idd, (err, grupo) => {
      if (err) {
        console.error("Fallo al get grupo debido a: ", err);
      }
      console.log("Grupo encontrado");
      res.json(grupo);
    });
  });
};

module.exports = controller;
