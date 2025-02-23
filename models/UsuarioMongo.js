const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    usuario: String,
    password: String,
    fecha: Date,
    texto: String,
    imagen: String
});

module.exports = mongoose.models.Usuario || mongoose.model("Usuario", usuarioSchema);
