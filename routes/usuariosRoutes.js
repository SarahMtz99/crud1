const express = require("express");
const { getUsuariosPostgres, getUsuariosMongo, getUsuariosPorDB } = require("../controllers/usuariosController");
const { editarUsuario, eliminarUsuario } = require("../controllers/userController");
const router = express.Router();


router.get("/usuarios/pg", getUsuariosPostgres);
router.get("/usuarios/mongo", getUsuariosMongo);


router.get("/usuarios/:db", getUsuariosPorDB);

router.put("/usuarios/:id", editarUsuario);


router.delete("/usuarios/:id", eliminarUsuario);s

module.exports = router;
