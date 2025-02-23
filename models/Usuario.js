const mongoose = require('mongoose');

// const usuarioSchema = new mongoose.Schema({
//     usuario: { type: String, required: true },
//     password: { type: String, required: true },
//     fecha: { type: Date, required: true },
//     texto: { type: String, required: true },
//     imagen: { type: String }
// });
const usuarioSchema = new mongoose.Schema({
    usuario: String,
    fecha: Date,
    texto: String,
    imagen: String
});
const Usuario = mongoose.model("Usuario", usuarioSchema);
// const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;

