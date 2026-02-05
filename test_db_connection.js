const { pool } = require("./config/database");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

console.log("Starting DB connection test...");

async function verifyConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connection successful! Database time:", res.rows[0].now);
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }
}

verifyConnection();
