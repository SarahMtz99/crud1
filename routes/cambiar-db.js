const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "12345a",
    port: 5432,
});

global.baseDeDatosActiva = "postgres"; 

async function connectMongoDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/mibase", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error conectando a MongoDB:", error);
    }
}

router.post('/cambiar-db', async (req, res) => {
    const { dbType } = req.body; 
    
    if (!dbType) {
        return res.status(400).json({ success: false, message: 'Tipo de base de datos no especificado' });
    }

    try {
        if (dbType === 'mongo') {
            await connectMongoDB();
            global.baseDeDatosActiva = 'mongo'; 
            console.log("Base de datos activa: MongoDB");
            return res.json({ success: true, message: 'Conectado a MongoDB' });
        } 
        
        else if (dbType === 'postgres') {
            await pool.connect();
            global.baseDeDatosActiva = 'postgres'; 
            console.log("Base de datos activa: PostgreSQL");
            return res.json({ success: true, message: 'Conectado a PostgreSQL' });
        } 
        
        else {
            return res.status(400).json({ success: false, message: 'Base de datos no válida' });
        }
    } catch (error) {
        console.error(`Error conectando a ${dbType}:`, error);
        return res.status(500).json({ success: false, message: 'Error al conectar con la base de datos' });
    }
});

module.exports = router;
