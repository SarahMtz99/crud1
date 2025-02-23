const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Usuario = require("../models/Usuario"); 

router.put("/mongo/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID de usuario no válido" });
        }

        const { usuario, fecha, texto } = req.body;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, { usuario, fecha, texto }, { new: true });

        if (!usuarioActualizado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ mensaje: "Usuario actualizado correctamente", usuario: usuarioActualizado });
    } catch (error) {
        console.error("Error en la actualización:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
