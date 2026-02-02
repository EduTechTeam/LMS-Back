const { pool } = require("../config/database.js");

//GET ALL CATEGORIES
exports.getAllCategories = async (skip, limit) => {
  const result = await pool.query(
    `SELECT * FROM categories LIMIT $1 OFFSET $2`,
    [limit, skip],
  );
  return result.rows;
};

//GET SINGLE CATEGORY
exports.getCategoryById = async (id) => {
  const result = await pool.query(`SELECT * FROM categories WHERE id = $1`, [
    id,
  ]);
  return result.rows[0];
};

//CREATE CATEGORY
exports.createCategory = async (name, description) => {
  const result = await pool.query(
    `INSERT INTO categories (name , description) VALUES ($1, $2) RETURNING *`,
    [name, description],
  );
  return result.rows[0];
};

//UPDATE CATEGORY
exports.updateCategory = async (id, name, description) => {
  const result = await pool.query(
    `UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
    [name, description, id],
  );
  return result.rows[0];
};

//DELETE CATEGORY
exports.deleteCategory = async (id) => {
  const result = await pool.query(`DELETE FROM categories WHERE id =$1`, [id]);
  return result.rows[0];
};
