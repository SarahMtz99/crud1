const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Usuario = require("../models/Usuario");

//obtener usuarios mongo
router.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuario", error });
    }
});

///crear usuario 
router.post("/api/mongo/usuarios", async (req, res) => {
    try {
        const { nombre, correo, contraseña, rol } = req.body;
        const nuevoUsuario = new Usuario({ nombre, correo, contraseña, rol });
        await nuevoUsuario.save();
        res.json({ mensaje: "Usuario creado correctamente" });
    } catch (error) {   
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: "No se pudo crear el usuario" });
    }
});

// Actualizar un usuario por ID
// const mongoose = require('mongoose');

// router.put('/api/usuarios/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { usuario, password, fecha, texto, imagen } = req.body;

//         console.log("ID recibido:", id);
//         console.log("Datos recibidos:", req.body);

//         if (global.baseDeDatosActiva === "mongo") {
//             //  Verificar si el ID es válido en MongoDB
//             if (!mongoose.Types.ObjectId.isValid(id)) {
//                 return res.status(400).json({ error: "ID inválido para MongoDB" });
//             }

//             const usuarioActualizado = await Usuario.findByIdAndUpdate(
//                 id,  
//                 { usuario, password, fecha, texto, imagen },
//                 { new: true }
//             );

//             if (!usuarioActualizado) {
//                 return res.status(404).json({ error: "Usuario no encontrado en MongoDB" });
//             }

//             return res.json(usuarioActualizado);
//         } else {
//             // Verificar si el ID es un número en PostgreSQL
//             const idNumerico = parseInt(id, 10);
//             if (isNaN(idNumerico)) {
//                 return res.status(400).json({ error: "ID inválido para PostgreSQL, debe ser un número" });
//             }

//             const query = "UPDATE usuarios SET usuario = $1, password = $2, fecha = $3, texto = $4, imagen = $5 WHERE id = $6 RETURNING *";
//             const values = [usuario, password, fecha, texto, imagen, idNumerico];
//             const usuarioActualizado = await pool.query(query, values);

//             if (usuarioActualizado.rowCount === 0) {
//                 return res.status(404).json({ error: "Usuario no encontrado en PostgreSQL" });
//             }

//             return res.json(usuarioActualizado.rows[0]);
//         }
//     } catch (error) {
//         console.error("Error en el servidor:", error);
//         res.status(500).json({ error: "Error interno del servidor" });
//     }
// });
router.put("/mongo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID no válido" });
        }

        const { usuario, fecha, texto } = req.body;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, { usuario, fecha, texto }, { new: true });

        if (!usuarioActualizado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ mensaje: "Usuario actualizado correctamente", usuario: usuarioActualizado });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//eliminar usuario
router.delete("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Intentando eliminar usuario con ID:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }

        const usuarioEliminado = await Usuario.findByIdAndDelete(id);

        if (!usuarioEliminado) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json({ mensaje: "Usuario eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});


module.exports = router;
