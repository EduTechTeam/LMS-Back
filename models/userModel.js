const { pool } = require("../config/database.js");
const bcrypt = require("bcrypt");

//GET ALL USERS
exports.getAllUsers = async (skip, limit) => {
  const result = await pool.query(`SELECT * FROM users LIMIT $1 OFFSET $2`, [
    limit,
    skip,
  ]);
  return result.rows;
};

//GET SINGLE USER
exports.getUserById = async (id) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0];
};

//GET SINGLE USER BY EMAIL
exports.getUserByEmail = async (email) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
};

//CREATE USER
exports.createUser = async (
  username,
  email,
  password,
  role = "student",
  headline,
  biography,
  avatar_url,
  website_url,
  full_name,
  verification_token,
) => {
  const password_hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (username, email, password_hash, role, headline, biography, avatar_url, website_url, full_name , verification_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 , $10) RETURNING *`,
    [
      username,
      email,
      password_hash,
      role,
      headline,
      biography,
      avatar_url,
      website_url,
      full_name,
      verification_token,
    ],
  );
  return result.rows[0];
};

//UPDATE USER
exports.updateUser = async (
  id,
  username,
  email,
  password_hash,
  role,
  headline,
  biography,
  avatar_url,
  website_url,
  full_name,
) => {
  const result = await pool.query(
    `UPDATE users SET username = $1, email = $2, password_hash = $3, role = $4, headline = $5, biography = $6, avatar_url = $7, website_url = $8, full_name = $9 WHERE id = $10 RETURNING *`,
    [
      username,
      email,
      password_hash,
      role,
      headline,
      biography,
      avatar_url,
      website_url,
      full_name,
      id,
    ],
  );
  return result.rows[0];
};

//DELETE USER
//DELETE USER
exports.deleteUser = async (id) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id],
  );
  return result.rows[0];
};

exports.verifyUser = async (token) => {
  const result = await pool.query(
    `UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = $1 RETURNING *`,
    [token],
  );
  return result.rows[0];
};

//save password reset token
exports.savePasswordResetToken = async (email, token, expires) => {
  const result = await pool.query(
    `UPDATE users SET password_reset_token = $1,
    password_reset_expires = $2 WHERE email = $3 RETURNING *`,
    [token, expires, email],
  );
  return result.rows[0];
};

//get user by reset token
exports.getUserByResetToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()`,
    [token],
  );
  return result.rows[0];
};

//reset password
exports.resetPassword = async (id, password_hash) => {
  const result = await pool.query(
    `UPDATE users SET password_hash = $1 , password_reset_token = NULL, 
    password_reset_expires = NULL WHERE id = $2 RETURNING *`,
    [password_hash, id]
  );
  return result.rows[0];
};
