const { Pool } = require("pg");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");


dotenv.config({ path: "config.env" });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const dbConnection = asyncHandler( async () => {
    const result = await pool.query("SELECT NOW()");
    console.log("DB connection successful", result.rows[0]);

});

// Graceful shutdown
process.on("exit", () => pool.end());
process.on("SIGINT", () =>
  pool.end(() => {
    console.log("DB pool closed");
    process.exit(0);
  })
);

module.exports = { pool, dbConnection };
