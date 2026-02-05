const { Pool } = require("pg");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");

dotenv.config({ path: "config.env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const dbConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("DB connection successful", result.rows[0]);
  } catch (err) {
    console.error("DB Connection Error:", err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("exit", () => pool.end());
process.on("SIGINT", () =>
  pool.end(() => {
    console.log("DB pool closed");
    process.exit(0);
  }),
);

module.exports = { pool, dbConnection };
