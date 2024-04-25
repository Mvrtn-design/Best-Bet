const controller = {};

controller.addTicket = (req, res) => {
  const competicion = req.body.competition;
  const potencial_prize = req.body.potencial_prize;
  const monedas_apostadas = req.body.coins;
  const status = req.body.status;

  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      `INSERT INTO ticket_apuestas  (id_competicion, cantidad_apostada, ganancia_potencial,estado) VALUES(?,?,?,?) `,
      [competicion, monedas_apostadas, potencial_prize, status],
      (errr, estado) => {
        if (errr) {
          console.error("Error: ", errr);
          res.json(errr); //manejar los errores con next (mas profesional)
        }
        iiiddd = estado.insertId;
        console.log("ticket creado");
        res.json(iiiddd);
      }
    );
  });
};

controller.addBet = (req, res) => {
  const ticket = req.body.ticket_id;
  const match = req.body.match_id;
  const eleccion = req.body.choice;
  console.log("EEE: ", ticket, match, eleccion)

  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      `INSERT INTO apuesta (id_partido, id_ticket, eleccion) VALUES(?,?,?)`,
      [match, ticket, eleccion],
      (errr, estado) => {
        if (errr) {
          console.error("Error: ", errr);
          res.json(errr); //manejar los errores con next (mas profesional)
        }
        iiiddd = estado.insertId;
        console.log("APUESTA CREADA");
        res.json(iiiddd);
      }
    );
  });
};

controller.cambiarEstadoTicket = (req, res) => {
  const idd = req.params.id;
  const estado = req.body.value1;
  console.log("ticket: ", idd, estado);

  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
      res.json({ error: err });
    }
    conn.query(
      "UPDATE  ticket_apuestas SET estado = ? where ID = ?",
      [estado, idd],
      (errr, estado) => {
        if (errr) {
          console.error(errr);
          res.json({ error: errr }); //manejar los errores con next (mas profesional)
        }
        res.json(estado);
      }
    );
  });
};

controller.getLiveBetsByCompeticion = (req, res) => {
  const idd = req.params.id;
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query("SELECT * FROM apuesta JOIN ticket_apuestas ON id_ticket = ticket_apuestas.ID WHERE id_competicion = ? AND estado = 'ON_GOING'", idd, (err, partida) => {
      if (err) {
        console.error("Fallo al get partida debido a: ", err);
      }
      console.log("Apuestas encontradas");
      res.json(partida);
    });
  });
};

module.exports = controller;
