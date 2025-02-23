const { Pool } = require("pg");
const mongoose = require("mongoose");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "12345a",
  port: 5432,
});


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

module.exports = { pool, connectMongoDB };
