const controller = {};


controller.clubsByCountry = (req, res) => {
    const country = req.query.value1;
    const limit = parseInt(req.query.value2);

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error al establecer la conexion");
        }
        conn.query(
            "SELECT * FROM club WHERE country = ? order by category, rand() limit ?", [country, limit],
            (err, clubs) => {
                if (err) {
                    console.error("Fallo al get competicion debido a: ", err);
                }
                console.log("Clubes encontrados");
                res.send(clubs);
            }
        );
    });
};
controller.getClubsByCompetition = (req, res) => {
    const competition = req.query.value1;

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error al establecer la conexion");
        }
        conn.query(
            "select * from club join estadisticas on nombre_equipo = name join grupo on id_grupo = grupo.ID join competicion on id_competicion = competicion.ID where id_competicion = ? and ronda = 'GROUP_STATE' order by category, rand() ASC", [competition],
            (err, clubs) => {
                if (err) {
                    console.error("Fallo al get competicion debido a: ", err);
                }
                console.log("Clubes de la competicion encontrados");
                res.send(clubs);
            }
        );
    });
};
controller.otherClubs = (req, res) => {
    const countries = req.query.value1;
    const limit = parseInt(req.query.value2);

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error al establecer la conexion");
        }
        conn.query(
            "SELECT * FROM club WHERE country not in (?) order by rand() limit ?", [countries, limit],
            (err, clubs) => {
                if (err) {
                    console.error("Fallo al get competicion debido a: ", err);
                }
                console.log("Clubes encontrados")
                res.send(clubs);
            }
        );
    });
};

module.exports = controller;
