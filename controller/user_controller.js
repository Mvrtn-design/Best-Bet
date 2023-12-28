const controller = {};

controller.listaUsuarios = (req, res) => {
  //getConnection es posible por el middleware creado en el archivo principal
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query("SELECT * FROM usuario", (err, usuarios) => {
      if (err) {
        res.json(err); //manejar los errores con next (mas profesional)
      }
      console.log("usuarios encontrados");
      res.send(usuarios);
    });
  });
};

controller.unUsuario = (req, res) => {
  //getConnection es posible por el middleware creado en el archivo principal
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query("SELECT * FROM usuario LIMIT 1", (err, usuarios) => {
      if (err) {
        res.json(err); //manejar los errores con next (mas profesional)
      }
      res.send(usuarios);
    });
  });
};

controller.irInicioSesion = (req, res) => {
  //getConnection es posible por el middleware creado en el archivo principal
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    res.render("login", {
      titulo: "LogIn",
    });
  });
};

controller.irRegistrarse = (req, res) => {
  //getConnection es posible por el middleware creado en el archivo principal
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    res.render("registrarse", {
      titulo: "Registro",
    });
  });
};

controller.guardarUsuario = (req, res) => {
  const datos_usuario = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      `INSERT INTO usuario SET ? `,
      [datos_usuario],
      (errr, usuarios) => {
        if (errr) {
          res.json(errr); //manejar los errores con next (mas profesional)
        }
        res.send("200:OK");
        console.log("GUARDADO");
      }
    );
  });
};

controller.eliminarUsuario = (req, res) => {
  const id = req.params.id;
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      `DELETE FROM usuario WHERE id = ? `,
      id,
      (errr, respuesta_ejecucion) => {
        if (errr) {
          res.json(errr); //manejar los errores con next (mas profesional)
        }
        res.redirect("/");
        console.log("ELIMINADO");
      }
    );
  });
};

controller.verUsuarioEditar = (req, res) => {
  const id = req.params.id;
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query("SELECT * FROM usuario WHERE id = ?", id, (err, usuario) => {
      console.log(usuario);
      res.render("update_user", {
        titulo: "Lista",
        data: usuario[0],
      });
    });
  });
};

controller.editarUsuario = (req, res) => {
  const id = req.params.id;
  const datos_usuario = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      `UPDATE usuario SET ? WHERE id = ? `,
      [datos_usuario, id],
      (errr, respuesta_ejecucion) => {
        if (errr) {
          res.json(errr); //manejar los errores con next (mas profesional)
        }
        res.redirect("/");
        console.log("ACTUALIZADO");
      }
    );
  });
};

module.exports = controller;
