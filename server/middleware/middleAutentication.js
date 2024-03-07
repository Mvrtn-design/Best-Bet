const { verify } = require('jsonwebtoken');

const tokenValido = (req, res, next) => {
    const tokenAcceso = req.header("tokenAcceso");

    if (!tokenAcceso) {
        return res.json({ error: "Usuario no logueado" });
    } else {
        try {
            const tokenValido = verify(tokenAcceso, "importantsecret");
            req.user = tokenValido;
            if (tokenValido) {
                return next();
            }
            return res.json({ error: "Token inválido o caducado" });
        } catch (err) {
            console.log(err)
            res.json({ error: "Token invalido" });
        }
    }
};
module.exports = { tokenValido };