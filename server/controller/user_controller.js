const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');


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

controller.actualizarMonedas = (req, res) => {
  const id = req.params.id;
  const estadoo = req.body.value1;

  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query(
      `UPDATE competicion SET monedas = ? WHERE id = ? `,
      [estadoo, id],
      (errr, estado) => {
        if (errr) {
          console.error(errr);
          res.json(errr); //manejar los errores con next (mas profesional)
        }
        console.log("Monedero actualizado");
        res.json(estado);
      }
    );
  });
};

controller.usuario_autenticado = (req, res) => {
  res.json(req.user);
}

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
controller.usuario_logueado = (req, res) => {
  //getConnection es posible por el middleware creado en el archivo principal
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    const id_user = req.user.id;
    conn.query("SELECT * FROM usuario WHERE id = ?", [id_user], (err, usuario) => {
      if (err) {
        res.json("Error".err); //manejar los errores con next (mas profesional)
      }
      console.log("Usuario encontrado");
      res.send(usuario[0]);
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
    bcrypt.hash(datos_usuario.clave, 10).then((hash) => {
      datos_usuario.clave = hash;
      conn.query(
        `INSERT INTO usuario SET ? `,
        [datos_usuario],
        (errr, usuarios) => {
          if (errr) {
            console.error("Error debido a: ", errr);
            res.json({ error: errr }); //manejar los errores con next (mas profesional)
          }
          console.log("Usuario guardado");
          res.json("Usuario Creado Correctamente");
        }
      );
    })

  });
};

controller.checkUsuario = (req, res) => {
  const datos_usuario = req.query.value;
  //getConnection es posible por el middleware creado en el archivo principal
  req.getConnection((err, conn) => {
    if (err) {
      console.log(`Error al establecer la conexion: ${err}`);
    }
    conn.query("SELECT * FROM usuario WHERE nombre_usuario = ? ", [datos_usuario.nombre_usuario], (err, usuario) => {
      if (err) {
        console.error("Hay un error: ", err);
        res.json({ error: "El usuario no se encuentra por: ", err }); //manejar los errores con next (mas profesional)
      }

      if (usuario.length == 1) {
        bcrypt.compare(datos_usuario.clave, usuario[0].clave).then((match) => {
          if (!match) {
            console.log("Error en la clave");
            res.json({ error: "Error en la clave" });
          } else {
            //LOGUEADO CORRECTAMENTE
            //TODO: generar de forma segura
            const tokenAcceso = sign({ username: usuario[0].nombre_usuario, id: usuario[0].id }, "importantsecret");
            console.log("TODO OK: ", usuario);
            res.json({ username: usuario[0].nombre_usuario, id: usuario[0].id, token: tokenAcceso });
          }
        });
      } else if (usuario.length == 0) {
        console.log("ninguno encontrado");
        res.json({ error: "No existe este Usuario" });
      } else {
        console.log("Error: varios usuarios con ese distinitivo");
        res.json({ error: "Error: Usuario duplicado" });
      }
    });
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
