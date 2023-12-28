const controller = {};

controller.crearCompeticion = (req, res) => {
  const datos_competicion = req.body;

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
        console.log("COMPETICION CREADA");
      }
    );
  });
};

controller.updateCompetitionState = (req, res) => {
  const idd = req.body.value1;
  const estadoo = req.body.value2;

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
        res.json(estado);
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

controller.getGroupsByCompetition = (req, res) => {
  const idd = req.query.value1;
  const ronda = req.query.value2;

  
  console.log("PARAMMMS: ",idd,ronda);
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query(
      "select * from club join estadisticas on club.ID = estadisticas.id_equipo  join grupo on estadisticas.id_grupo = grupo.ID   join competicion on grupo.id_competicion = competicion.ID   where competicion.ID = ? and grupo.ronda = ?  order by grupo.letra",
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

controller.guardarGrupo = (req, res) => {
  const datos_competicion = req.body.value1;
  const ronda = req.body.value2;
  const letra = req.body.value3;

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
          return next(errr);
        }
        const ddd = grupo.insertId;
        console.log("GRUPO CREADO: ", ddd);
        res.json(ddd);
      }
    );
  });
};

controller.addEquipoToGroup = (req, res) => {
  const id_grupo = req.body.value1;
  const team_ID = req.body.value2;

  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      "INSERT INTO estadisticas (id_grupo, id_equipo) VALUES (?, ?)",
      [id_grupo, team_ID],
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
      "SELECT * FROM competicion WHERE competicion.partida = (SELECT ID FROM partida WHERE usuario = ? limit 1)",
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
