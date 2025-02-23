// const { pool } = require("../config/db");
// const UsuarioMongo = require("../models/usuarioMongo");
const { pool } = require("../config/bdConfig");
const Usuario = require("../models/Usuario"); 

// const Usuario = require("../models/Usuario");

const obtenerUsuarios = async (req, res) => {
  try {
      const usuarios = await Usuario.find(); 
      console.log("Usuarios obtenidos:", usuarios); 
      
      if (!Array.isArray(usuarios)) {
          return res.status(500).json({ error: "La API no devolvió un array válido." });
      }

      res.json(usuarios);
  } catch (error) {
      console.error("Error en obtenerUsuarios:", error);
      res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// router.put("/api/usuarios/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { usuario, fecha, texto } = req.body;

//         const usuarioActualizado = await Usuario.findByIdAndUpdate(
//             id,
//             { usuario, fecha, texto },
//             { new: true }
//         );

//         if (!usuarioActualizado) {
//             return res.status(404).json({ message: "Usuario no encontrado" });
//         }

//         res.json({ message: "Usuario actualizado con éxito", usuario: usuarioActualizado });
//     } catch (error) {
//         console.error("Error al actualizar usuario:", error);
//         res.status(500).json({ message: "Error del servidor" });
//     }
// });
  
// router.put("/api/usuarios/:id", async (req, res) => {
//     try {
//         console.log("Body recibido:", req.body); // Para depuración

//         if (!req.body || Object.keys(req.body).length === 0) {
//             return res.status(400).json({ mensaje: "El cuerpo de la solicitud está vacío" });
//         }

//         const { id } = req.params;
//         const { usuario, fecha, texto } = req.body;

//         const usuarioActualizado = await Usuario.findByIdAndUpdate(
//             id,
//             { usuario, fecha, texto },
//             { new: true }
//         );

//         if (!usuarioActualizado) {
//             return res.status(404).json({ mensaje: "Usuario no encontrado" });
//         }

//         res.json({ mensaje: "Usuario actualizado con éxito", usuario: usuarioActualizado });
//     } catch (error) {
//         console.error("Error al actualizar usuario:", error);
//         res.status(500).json({ mensaje: "Error del servidor" });
//     }
// });


const getUsuariosMongo = async (req, res) => {
  try {
    const usuarios = await UsuarioMongo.find();
    res.json(usuarios);
  } catch (error) {
    console.error("Error obteniendo datos de MongoDB:", error);
    res.status(500).json({ error: "Error en MongoDB" });
  }
};


const getUsuariosPorDB = async (req, res) => {
  try {
      if (global.baseDeDatosActiva === "postgres") {
          const result = await pool.query("SELECT * FROM usuarios");
          return res.json(result.rows);
      } else if (global.baseDeDatosActiva === "mongo") {
          const usuarios = await UsuarioMongo.find();
          return res.json(usuarios);
      } else {
          return res.status(400).json({ error: "Base de datos no válida" });
      }
  } catch (error) {
      console.error(" Error obteniendo datos:", error);
      res.status(500).json({ error: "Error en la consulta" });
  }
};

// router.put("/api/mongo/usuarios/:id", async (req, res) => {
//   console.log(" Datos recibidos en el servidor:", req.body);
//   console.log(" ID recibido:", req.params.id);

//   if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({ error: "El cuerpo de la solicitud está vacío" });
//   }

 
// });
app.get('/api/usuarios', async (req, res) => {
  try {
      const usuarios = await obtenerUsuariosDesdeBD(); // Aquí obtienes los datos de la DB

      const usuariosConImagen = usuarios.map(usuario => {
          return {
              ...usuario,
              imagen: usuario.imagen ? `/uploads/${path.basename(usuario.imagen)}` : null
          };
      });

      res.json(usuariosConImagen);
  } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
});

async function obtenerUsuarios(req, res) {
  try {
      const usuarios = await obtenerUsuariosDesdeBD();

      const usuariosConImagen = usuarios.map(usuario => {
          let imagenPath = usuario.imagen ? `/uploads/${path.basename(usuario.imagen)}` : null;
          return { ...usuario, imagen: imagenPath };
      });

      res.json(usuariosConImagen);
  } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
}


module.exports = { getUsuariosMongo, getUsuariosPorDB, obtenerUsuarios};
