const mongoose = require("mongoose");
require("dotenv").config();
const { Pool } = require("pg");


const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "12345a",
    port: 5432,
});
pool
    .connect()
    .then(() => console.log("Conectado a PostgreSQL"))
    .catch((err) => console.error("Error conectando a PostgreSQL:", err));


const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mibase";

mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Conectado a MongoDB"))
    .catch((err) => console.error(" Error conectando a MongoDB:", err));

// module.exports = { mongoose, pool };
// module.exports = { pool, mongoose }; 
module.exports = pool; 