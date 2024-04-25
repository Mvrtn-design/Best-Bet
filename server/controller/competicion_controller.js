const controller = {};

controller.crearCompeticion = (req, res) => {
  const datos_competicion = req.body;
  console.log(datos_competicion);

  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      `INSERT INTO competicion SET ? `,
      [datos_competicion],
      (errr, competicion) => {
        if (errr) {
          res.json(errr); //manejar los errores con next (mas profesional)
        }
        const idd = competicion.insertId;
        res.json(idd);
        console.log("COMPETICIÓN CREADA");
      }
    );
  });
};

controller.eliminarCompeticion = (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log("iiiiii: ", req.idd);
  const id = req.idd;
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      `DELETE FROM competicion WHERE ID = ?`,
      id,
      (errr, respuesta_ejecucion) => {
        if (errr) {
          console.error(errr);
          res.json(errr); //manejar los errores con next (mas profesional)
        }
        console.log("Competicion eliminada");
        res.json(respuesta_ejecucion);
      }
    );
  });
};

controller.getClubesByCompetition = (req, res) => {
  const idd = req.query.value1;
  const ronda = req.query.value2;

  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query(
      "select * from club join estadisticas on club.name = estadisticas.nombre_equipo  join grupo on estadisticas.id_grupo = grupo.ID   join competicion on grupo.id_competicion = competicion.ID   where competicion.ID = ? and grupo.ronda = ?  order by grupo.letra",
      [idd, ronda],
      (err, grupos) => {
        if (err) {
          console.error("Fallo al get competicion debido a: ", err);
        }
        console.log("Grupos encontrados");
        res.json(grupos);
      }
    );
  });
};

controller.updateCompetitionState = (req, res) => {
  const idd = req.body.value1;
  const estadoo = req.body.value2;
  console.log(estadoo, idd);
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      `UPDATE competicion SET estado = ? WHERE ID = ? `,
      [estadoo, idd],
      (errr, estado) => {
        if (errr) {
          res.json(errr); //manejar los errores con next (mas profesional)
        }
        console.log("Estado actualizado");
        res.json(estado);
      }
    );
  });
};



controller.avanzarUnDia = (req, res) => {
  const idd = req.body.value1;
  console.log("id: ", idd);

  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      "UPDATE competicion  SET dia = DATE_ADD(dia, INTERVAL 1 DAY)   WHERE id = ?",
      [idd],
      (errr, estado) => {
        if (errr) {
          console.error("eeeeeeror al cambiooo: ", errr);
          res.json({ error: errr }); //manejar los errores con next (mas profesional)
        }
        conn.query(
          "SELECT Idd FROM partido join grupo on id_group = grupo.ID join competicion on grupo.id_competicion = competicion.ID WHERE competicion.ID = ? and date(fecha) = (SELECT date(dia) FROM competicion WHERE ID = ?);",
          [idd, idd],
          (errr, estado) => {
            if (errr) {
              console.error("Error al cambiar de fecha");
              res.json(errr); //manejar los errores con next (mas profesional)
            }
            console.log("cambioooo: ", estado);
            res.json(estado);
          }
        );
      }
    );
  });
};

controller.listaCompeticiones = (req, res) => {
  //getConnection es posible por el middleware creado en el archivo principal
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query("SELECT * FROM partida", (err, partidas) => {
      if (err) {
        res.json(err); //manejar los errores con next (mas profesional)
      }
      res.send(partidas);
    });
  });
};

controller.getCompeticionByID = (req, res) => {
  const idd = req.params.id;
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query(
      "SELECT * FROM competicion WHERE ID = ?",
      idd,
      (err, partida) => {
        if (err) {
          console.error("Fallo al get competicion debido a: ", err);
        }
        console.log("Competicion encontrada");
        res.json(partida);
      }
    );
  });
};

controller.getTeamNamesByIDpartido = (req, res) => {
  const idd = req.params.id;
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query(
      "SELECT * FROM competicion WHERE ID = ?",
      idd,
      (err, partida) => {
        if (err) {
          console.error("Fallo al get competicion debido a: ", err);
        }
        console.log("Nombre de equipos encontrados");
        res.json(partida);
      }
    );
  });
};

controller.getGroupsByCompetition = (req, res) => {
  const idd = req.query.value1;
  const ronda = req.query.value2;

  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query(
      "select * from club join estadisticas on club.name = estadisticas.nombre_equipo  join grupo on estadisticas.id_grupo = grupo.ID   join competicion on grupo.id_competicion = competicion.ID   where competicion.ID = ? and grupo.ronda = ?  order by grupo.letra",
      [idd, ronda],
      (err, grupos) => {
        if (err) {
          console.error("Fallo al get competicion debido a: ", err);
        }
        console.log("Grupos encontrados");
        res.json(grupos);
      }
    );
  });
};

controller.getMatchesByCompetition = (req, res) => {
  const idd = req.query.value1;
  const ronda = req.query.value2;

  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query(
      "select * from partido join grupo on partido.id_group = grupo.ID join competicion on grupo.id_competicion = competicion.ID  where competicion.ID = ? and grupo.ronda = ?  order by bestbetdb.partido.fecha",
      [idd, ronda],
      (err, grupos) => {
        if (err) {
          console.error("Fallo al get partidos debido a: ", err);
        }
        console.log("Partidos encontrados");
        res.json(grupos);
      }
    );
  });
};

controller.guardarGrupo = (req, res) => {
  const datos_competicion = req.body.value1;
  const ronda = req.body.value2;
  const letra = req.body.value3;
  console.log("recibido en grupo: ", datos_competicion, ronda, letra);

  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      "INSERT INTO grupo (id_competicion, ronda, letra) VALUES (?, ?, ?)",
      [datos_competicion, ronda, letra],
      (errr, grupo, next) => {
        if (errr) {
          console.log(`Error al insertar el grupo: ${errr}`);
          res.json({ error: errr });
        }
        const ddd = grupo.insertId;
        console.log("GRUPO CREADO: ", ddd);
        res.json(ddd);
      }
    );
  });
};

controller.guardarPartido = (req, res) => {
  const local = req.body.local;
  const visitante = req.body.visitante;
  const fecha = req.body.fecha;
  const location = req.body.location;
  const stadium = req.body.stadium;
  const grupo = req.body.grupo;
  const cuotaLocal = req.body.cuota_local;
  const cuotaEmpate = req.body.cuota_empate;
  const cuotaVisitante = req.body.cuota_visitante;

  console.log("cuotas: ", cuotaLocal, cuotaEmpate, cuotaVisitante);


  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      "INSERT INTO partido (club_local, club_visitante,fecha, location,stadium,id_group,cuota_local,cuota_empate,cuota_visitante) VALUES (?, ?, ?,?,?,?,?,?,?)",
      [local, visitante, fecha, location, stadium, grupo, cuotaLocal, cuotaEmpate, cuotaVisitante],
      (errr, grupo) => {
        if (errr) {
          console.log(`Error al insertar el partido: ${errr}`);
          res.json(errr);
        }
        console.log("PARTIDO CREADO");
        res.json(grupo);
      }
    );
  });
};

controller.addEquipoToGroup = (req, res) => {
  const id_grupo = req.body.value1;
  const team_name = req.body.value2;

  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      "INSERT INTO estadisticas (id_grupo, nombre_equipo) VALUES (?, ?)",
      [id_grupo, team_name],
      (errr, grupo) => {
        if (errr) {
          console.log(`Error al insertar el equipo: ${errr}`);
          return next(errr);
        }
        console.log("EQUIPO AGRUPADO");
        res.json(grupo);
      }
    );
  });
};

controller.getCompeticionByPartida = (req, res) => {
  const idd = req.params.id;
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query(
      "SELECT * FROM competicion WHERE competicion.partida = ? LIMIT 1",
      idd,
      (err, competicion) => {
        if (err) {
          console.error("Fallo al get competicion debido a: ", err);
        }
        console.log("Una competicion encontrada");
        res.json(competicion);
      }
    );
  });
};

controller.getCompeticionesByUser = (req, res) => {
  const id_user = req.params.id;
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query(
      "SELECT competicion.ID,competicion.nombre,competicion.estado,competicion.temporada, competicion.partida FROM competicion JOIN partida ON competicion.partida = partida.ID WHERE partida.usuario = ? limit 20",
      id_user,
      (err, competiciones) => {
        if (err) {
          console.error("Fallo al get competicion debido a: ", err);
        }
        res.json(competiciones);
      }
    );
  });
};

module.exports = controller;
