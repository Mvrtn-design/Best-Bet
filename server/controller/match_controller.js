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
  const idd = req.body.value1;
  console.log("cambio estado para: ", idd);

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
  const estado_partido = req.body.value3;

  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query(
      `UPDATE estadisticas join partido on id_group = id_grupo SET marcador_local = ?, marcador_visitante = ?, estado_partido = ? WHERE IDD = ? `,
      [golesLocal, golesVisitante, estado_partido, idd],
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


controller.updateEstadisticasEquipo = (req, res) => {
  const club_name = req.params.club;
  const id_grupo = req.params.id_group;
  console.log("club: ",club_name,id_grupo);

  const ganados = req.body.ganados;
  const empatados = req.body.empatados;
  const perdidos = req.body.perdidos;
  const marcados = req.body.marcados;
  const encajados = req.body.encajados;
  const puntos = req.body.puntos;
  console.log("valor de value1: ", req.body);
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
      res.json({error:err})
    }
    conn.query(
      `UPDATE estadisticas JOIN partido ON id_grupo = id_group SET ganados = ganados + ?, empatados = empatados + ? , perdidos = perdidos + ?, goles_a_favor = goles_a_favor + ?, goles_en_contra = goles_en_contra + ?, puntos = puntos + ? where nombre_equipo = ? and id_grupo = ? `,
      [ganados, empatados, perdidos, marcados, encajados, puntos, club_name, id_grupo],
      (err, partido) => {
        if (err) {
          console.error("Fallo al get partido debido a: ", err);
          res.json({error:"No se pudo actualizar los datos por: ",err});
        }
        console.log("ESTADISTICAS ACTUALIZADAS");
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
      "SELECT idd from partido join grupo on id_group = grupo.ID  join competicion on id_competicion = competicion.ID where id_competicion = ? and estado_partido = 'READY_TO_PLAY'",
      idd,
      (err, partido) => {
        if (err) {
          console.error("Fallo al get partido debido a: ", err);
        }
        console.log("ACTUALIZADO: ", partido);
        res.json(partido);
      }
    );
  });
};

module.exports = controller;
