require("dotenv").config();
const path = require("path");
const cambiarDBRoutes = require("./routes/cambiar-db")

const express = require("express");
const cors = require("cors");
const pool = require("./config/db"); 
const usuarioRoutes = require('./routes/usuarios');  
const { Pool } = require("pg");  
const mongoose = require("mongoose"); 
const app = express();
const PORT = process.env.PORT || 3000;
// const mongoRoutes = require("./routes/mongo");
const usuariosRoutes = require("./controllers/usuariosController");
const userController = require("./controllers/userController");
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const multer = require("multer");
app.use("/uploads", express.static("uploads"))
const router = express.Router();
const mongoUsuariosRoutes = require("./routes/mongoUsuarios");
app.use("/api/mongo", mongoUsuariosRoutes);
const mongoRoutes = require("./routes/mongo");
// const mongoRoutes = require("./routes/mongo"); 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage });
app.use(router);

// app.use("/api", mongoRoutes);
app.use("/uploads", express.static("uploads"))
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); 
// app.use(usuariosRoutes);
app.use("/", cambiarDBRoutes);
app.use('/api', usuarioRoutes);
app.use("/api/usuarios", usuarioRoutes); 
app.use("/api", mongoRoutes);
// const usuariosRoutes = require("./routes/usuarios");
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Error conectando a PostgreSQL:", err);
    } else {
        console.log("Conexión a PostgreSQL exitosa:", res.rows);
    }
});

app.use((req, res, next) => {
    console.log(`Petición recibida: ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// app.get("/usuarios", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "login.html"));
// });

app.post("/cambiar-db", (req, res) => {
    const { dbType } = req.body;


    if (dbType === "mongo") {
        console.log("Base de datos cambiada a MongoDB");
        return res.json({ mensaje: "Base de datos cambiada a MongoDB" });
    } else if (dbType === "postgres") {
        console.log("Base de datos cambiada a PostgreSQL");
        return res.json({ mensaje: "Base de datos cambiada a PostgreSQL" });
    } else {
        return res.status(400).json({ mensaje: "Base de datos no válida" });
    }
    
});

app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await obtenerUsuariosDesdeBD(); 
        res.json(usuarios); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

// router.get("/", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM usuarios"); // Ajusta el nombre de la tabla si es diferente
//         res.json(result.rows);
//     } catch (error) {
//         console.error("Error obteniendo usuarios:", error);
//         res.status(500).json({ error: "Error al obtener usuarios" });
//     }
// });

// router.post('/usuarios', async (req, res) => {
//     try {
//         const { usuario, password, fecha, texto, imagen } = req.body;
//         const nuevoUsuario = new Usuario({ usuario, password, fecha, texto, imagen });
//         await nuevoUsuario.save();
//         res.status(201).json({ mensaje: 'Usuario creado', usuario: nuevoUsuario });
//     } catch (error) {
//         res.status(500).json({ mensaje: ' Error', error });
//     }
// });
app.delete("/api/usuarios/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const usuarioExistente = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);

        if (usuarioExistente.rowCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
        res.json({ message: "Usuario eliminado correctamente" });

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
});


app.put("/api/usuarios/:id", upload.single("imagen"), async (req, res) => {
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

        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});


// 
//   const upload = multer({ storage });

router.post("/subir-imagen", upload.single("imagen"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ninguna imagen" });
    }
  
    res.json({ imagen: req.file.filename }); 
  });
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
  router.use("/uploads", express.static("uploads"));
  app.post("/api/upload", upload.single("imagen"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No se subió ninguna imagen" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
