const controller = {};

controller.crearPartida = (req, res) => {
  const datos_partida = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      `INSERT INTO partida SET ? `,
      [datos_partida],
      (errr, partida) => {
        if (errr) {
          res.json(errr); //manejar los errores con next (mas profesional)
        }
        iiiddd = partida.insertId;
        res.json(iiiddd);
        console.log("PARTIDA CREADA");
      }
    );
  });
};

controller.listaPartidas = (req, res) => {
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

controller.getPartidaByID = (req, res) => {
  const idd = req.params.id;
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query("SELECT * FROM partida WHERE ID = ?", idd, (err, partida) => {
      if (err) {
        console.error("Fallo al get partida debido a: ", err);
      }
      console.log("Partida encontrada");
      res.json(partida);
    });
  });
};

controller.getUSerByPartida = (req, res) => {
  const idd = req.params.id;
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query("SELECT * FROM usuario WHERE ID = (SELECT usuario FROM partida WHERE ID = ?)", idd, (err, usuario) => {
      if (err) {
        console.error("Fallo al get usuario debido a: ", err);
      }
      console.log("Usuario encontrada");
      res.json(usuario);
    });
  });
};

module.exports = controller;
