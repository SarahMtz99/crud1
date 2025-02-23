const express = require("express");
const multer = require("multer");
const Usuario = require("../models/Usuario"); 
const pool = require("../config/db"); 
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/' });
const { obtenerUsuarios } = require("../controllers/usuariosController");
//registrar usuarios 

router.get("/mongoUsuarios", obtenerUsuarios);
router.post("/usuarios", upload.single("imagen"), async (req, res) => {
    try {
        console.log(" Body recibido:", req.body);
        console.log(" Archivo recibido:", req.file ? req.file
            .originalname : "Ninguno");

        const { usuario, password, fecha, texto } = req.body;

        if (!usuario || !password || !fecha || !texto) {
            console.error("Error: Datos incompletos", req.body);
            return res.status(400).json({ mensaje: " Faltan datos obligatorios" });
        }

        if (global.baseDeDatosActiva === "mongo") {
            const nuevoUsuario = new Usuario({
                usuario,
                password,
                fecha,
                texto,
                imagen: req.file ? req.file.originalname : null
            });

            await nuevoUsuario.save();
            console.log("Usuario guardado en MongoDB:", nuevoUsuario);
        } else if (global.baseDeDatosActiva === "postgres") {
            
            const query = "INSERT INTO usuarios (usuario, password, fecha, texto, imagen) VALUES ($1, $2, $3, $4, $5) RETURNING *";
            const values = [usuario, password, fecha, texto, req.file ? req.file.originalname : null];

            const result = await pool.query(query, values);
            console.log("Usuario guardado en PostgreSQL:", result.rows[0]);
        } else {
            return res.status(400).json({ mensaje: "Base de datos no válida" });
        }

        res.json({ mensaje: "Usuario registrado correctamente", usuario, fecha });
    } catch (error) {
        console.error("Error al guardar usuario:", error);
        res.status(500).json({ mensaje: " Error interno del servidor" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { usuario, password } = req.body;
        if (!usuario || !password) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
        }

        const result = await pool.query("SELECT * FROM usuarios WHERE usuario = $1 AND password = $2", [usuario, password]);

        if (result.rows.length === 0) {
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        res.json({ mensaje: "Login exitoso", usuario: result.rows[0] });
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});
router.get("/usuarios", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios"); 
        res.json(result.rows);
    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});
router.get('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);

        if (usuario.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(usuario[0]);
    } catch (error) {
        console.error("Error en la API:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ error: "Error al obtener usuario" });
    }
});

// app.delete('/api/usuarios/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const resultado = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

//         if (resultado.affectedRows === 0) {
//             return res.status(404).json({ mensaje: "Usuario no encontrado" });
//         }

//         res.json({ mensaje: "Usuario eliminado correctamente" });
//     } catch (error) {
//         console.error("Error al eliminar usuario:", error);
//         res.status(500).json({ mensaje: "Error del servidor" });
//     }
// });
router.delete("/usuarios/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const usuarioExistente = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);

        if (usuarioExistente.rowCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
        res.json({ message: `Usuario con ID ${id} eliminado correctamente` });

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
router.put("/usuarios/:id", upload.single("imagen"), async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario, fecha, texto } = req.body;
        const imagen = req.file ? req.file.filename : null;

        console.log("ID recibido:", id);
        console.log("Datos recibidos:", req.body);
        console.log("Imagen recibida:", imagen);

        if (!usuario || !fecha || !texto) {
            return res.status(400).json({ message: "Faltan datos" });
        }
        const usuarioExistente = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);
        if (usuarioExistente.rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        let query;
        let values;

        if (imagen) {
            query = "UPDATE usuarios SET usuario = $1, fecha = $2, texto = $3, imagen = $4 WHERE id = $5";
            values = [usuario, fecha, texto, imagen, id];
        } else {
            query = "UPDATE usuarios SET usuario = $1, fecha = $2, texto = $3 WHERE id = $4";
            values = [usuario, fecha, texto, id];
        }

        const resultado = await pool.query(query, values);

        if (resultado.rowCount > 0) {
            res.json({ message: "Usuario actualizado correctamente" });
        } else {
            res.status(404).json({ message: "No se pudo actualizar el usuario" });
        }
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});



     ;
router.post("/subir-imagenes", upload.array("imagenes", 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No se subieron imágenes" });
    }

    res.json({
        mensaje: "Imágenes subidas correctamente",
        archivos: req.files.map((file) => file.filename),
    });
});
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Error al cerrar sesión" });
        }
        res.clearCookie("connect.sid"); 
        res.status(200).json({ message: "Sesión cerrada exitosamente" });
    });
});
router.post("/usuarios", upload.single("imagen"), async (req, res) => {
    try {
        const { usuario, password, fecha, texto } = req.body;
        if (!usuario || !password || !fecha || !texto) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
        }

        const imagen = req.file ? req.file.filename : null; // Guardar el nombre de la imagen

        const query = "INSERT INTO usuarios (usuario, password, fecha, texto, imagen) VALUES ($1, $2, $3, $4, $5)";
        const values = [usuario, password, fecha, texto, imagen];

        await pool.query(query, values);

        res.json({ 
            mensaje: "Usuario registrado correctamente", 
            usuario, 
            fecha, 
            imagen 
        });

    } catch (error) {
        console.error("Error al guardar usuario:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});


module.exports = router;
