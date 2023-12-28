const controller = {};

controller.getClubes = (req, res) => {
  //getConnection es posible por el middleware creado en el archivo principal
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query("SELECT * FROM club ", (err, clubs) => {
      console.log("Clubs obtained");
      res.json(clubs);
    });
  });
};


controller.getClubByName = (req, res) => {
  const name = req.params.name;
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query("SELECT * FROM club WHERE name = ?", name, (err, club) => {
      if (err) {
        console.error("Fallo al get info club por : ", err);
      }
      console.log("Team found");
      res.json(club);
    });
  });
};

controller.getSomeClubesByCategory = (req, res) => {
  const amount = parseInt(req.params.cantidadClubes, 10); //en base 10
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error al establecer la conexion");
    }
    conn.query(
      "SELECT * FROM club ORDER BY category asc LIMIT ?",
      amount,
      (err, clubs) => {
        if (err) {
          console.error("Fallo al get info club por : ", err);
        }
        console.log("Teams found: ", amount);
        res.json(clubs);
      }
    );
  });
};

controller.storeClubsJSON = (req, res) => {
  const jsonCLubs = req.body.clubs;
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    try {
      jsonCLubs.map(async (team) => {
        const name = team.name;
        const full_name = team.full_name;
        const country = team.country;
        const category = team.category;
        const stadium = team.stadium;
        const colors = JSON.stringify(team.colors);
        const nickname = JSON.stringify(team.nickname);

        conn.query(
          "INSERT INTO club (name, full_name, country, category, stadium, colors, nickname) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [name, full_name, country, category, stadium, colors, nickname],
          (err, club) => {
            if (!err) {
              console.log("Insertado equipo ", club[0]);
            } else {
              console.log("No insert por: ", err);
            }
          }
        );
      });
      res.JSON(club);
    } catch (error) {
      console.log("Error en el array de equipos", error);
    }
  });
};

controller.getClubNames = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }

    conn.query("SELECT name FROM club ", (err, names) => {
      console.log("Club names obtained");
      res.json(names);
    });
  });
};

module.exports = controller;
